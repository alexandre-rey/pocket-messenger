import { Channel } from "@/interfaces";
import { PbUtils } from "@/pb.utils";
import { Action, ActionType } from "@/state/action";
import { CurrentStateContext, DispatchContext } from "@/state/state.context";
import { useContext, useEffect, useState } from "react";


const ChannelsMenu = () => {

    const [joinedChannels, setJoinedChannels] = useState<Channel[]>([]);
    const currentState = useContext(CurrentStateContext);
    const dispatch = useContext(DispatchContext);

    useEffect(() => {
        PbUtils.getJoinedChannels().then((channels) => {
            setJoinedChannels(channels);
        });
    }, [currentState.channelId]);

    const handleClick = (channelId: string, channelName: string) => {
        const action: Action = {
            type: ActionType.SET_CURRENT_CHANNEL,
            payload: {
                channelId: channelId,
                channelName: channelName,
            }
        };

        dispatch && dispatch(action);
    }

    return (
        <div className='menu_container alt_menu_container'>
            <div className='alt_menu_content'>
                <h3>Channels</h3>
                <div className='alt_menu_list'>
                    {joinedChannels.map((channel) => (
                        <div key={channel.id} className='alt_menu_item' onClick={() => handleClick(channel.id, channel.name)}>
                            <p>{channel.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChannelsMenu;