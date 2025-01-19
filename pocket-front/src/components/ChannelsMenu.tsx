import { useContext, useEffect, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { RecordModel, RecordSubscription } from "pocketbase";
import { Channel } from "@/interfaces/chat.interface";
import { Collections, PbUtils } from "@/pb.utils";
import { ActionType } from "@/state/action";
import { CurrentStateContext, DispatchContext } from "@/state/state.context";

interface ChannelWithStatus extends Channel {
  hasNewMessages: boolean;
}

const ChannelsMenu = () => {
  const { t } = useTranslation();
  const currentState = useContext(CurrentStateContext);
  const dispatch = useContext(DispatchContext);

  // Single state for channels with their status
  const [channels, setChannels] = useState<ChannelWithStatus[]>([]);

  // Load channels and set initial state
  const fetchChannels = useCallback(async () => {
    try {
      const fetchedChannels = await PbUtils.getJoinedChannels();
      setChannels(fetchedChannels.map(channel => ({
        ...channel,
        hasNewMessages: false
      })));
    } catch (error) {
      console.error("Failed to fetch channels:", error);
    }
  }, []);

  // Handle channel selection
  const handleChannelSelect = useCallback((channel: Channel) => {
    // Update channel status
    setChannels(current =>
      current.map(ch => ({
        ...ch,
        hasNewMessages: ch.id === channel.id ? false : ch.hasNewMessages
      }))
    );

    // Update global state
    dispatch?.({
      type: ActionType.SET_CURRENT_CHANNEL,
      payload: { channel }
    });
  }, [dispatch]);

  // Handle message updates
  const handleMessageUpdate = useCallback(async (event: RecordSubscription<RecordModel>) => {
    try {
      const user = await PbUtils.getUserProfile();
      if (!event.record.users.includes(user.id)) return;

      const channelId = event.record.id;
      if (channelId === currentState.channel.id) return;

      setChannels(current =>
        current.map(channel => {

          let tmpNew = channel.hasNewMessages;

          if (new Date(channel.lastMessage) < new Date(event.record.lastMessage) && channel.id === channelId) {
            tmpNew = true;
          }

          return {
            ...channel,
            hasNewMessages: tmpNew,
            lastMessage: channel.id === channelId ? event.record.lastMessage : channel.lastMessage
          }
        })
      );
    } catch (error) {
      console.error("Error handling message update:", error);
    }
  }, [currentState.channel.id]);

  // Initial channel load
  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  // Subscribe to channel updates
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const setupSubscription = async () => {
      try {
        unsubscribe = await PbUtils.subscribeToCollection(
          Collections.CHANNELS,
          handleMessageUpdate
        );
      } catch (error) {
        console.error("Failed to subscribe to channels:", error);
      }
    };

    setupSubscription();

    return () => {
      unsubscribe?.();
    };
  }, [handleMessageUpdate]);

  // Refresh channels when current channel changes
  useEffect(() => {
    fetchChannels();
  }, [currentState.channel.id, fetchChannels]);

  return (
    <div className="menu_container alt_menu_container">
      <div className="alt_menu_content">
        <h3>{t("channels")}</h3>
        <div className="alt_menu_list">
          {channels.map((channel) => (
            <button
              key={channel.id}
              className="alt_menu_item"
              onClick={() => handleChannelSelect(channel)}
            >
              {channel.hasNewMessages ? (
                <strong>{channel.name}</strong>
              ) : channel.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChannelsMenu;