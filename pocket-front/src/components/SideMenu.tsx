import { useMatomo } from '@datapunt/matomo-tracker-react';
import { useContext, useEffect, useState } from 'react';

import { Action, ActionType } from '../state/action';
import { CurrentStateContext, DispatchContext } from '../state/state.context';

import pb, { BASE_URL } from '@/pocketbase';
import '../styles/menu.css';
import { PageType } from '@/state/state';
import { Channel } from '@/interfaces';

const SideMenu = () => {
  const { trackEvent } = useMatomo();
  const dispatch = useContext(DispatchContext);
  const currentState = useContext(CurrentStateContext);
  const [members, setMembers] = useState<{ username: string, id: string, avatar: string }[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const channel = await pb.collection<Channel>('channels').getOne(currentState.channelId);

      let filterStr = '';

      for (let i = 0; i < channel.users.length; i++) {
        filterStr += 'id=\'' + channel.users[i] + '\'' + (i === channel.users.length - 1 ? '' : ' || ');
      }

      console.log('Filter string:', filterStr);

      const members = await pb.collection('usersOverview').getFullList<{ username: string, id: string, avatar: string }>({
        filter: filterStr,
      });

      setMembers(members);
    };

    if (currentState.currentPage === PageType.CONVERSATIONS) {
      fetchMembers();
    }
  }, [currentState.channelId, currentState.currentPage]);

  const logout = () => {
    trackEvent({
      category: 'User',
      action: 'logout',
      name: pb.authStore.model?.username,
    });
    pb.authStore.clear();
    const action: Action = {
      type: ActionType.SET_LOGGED,
      payload: {
        isLogged: false,
      },
    };

    dispatch && dispatch(action);
  };

  const handleMenuClick = (page: PageType) => {
    const action: Action = {
      type: ActionType.SET_CURRENT_PAGE,
      payload: {
        currentPage: page,
      },
    };

    dispatch && dispatch(action);
  };

  return (
    <>
      <div className={'menu_container' + (currentState.currentPage === PageType.CONVERSATIONS ? ' no_margin' : '')}>
        <nav>
          <div className='menu_button' role='button' >
            <button
              aria-label='Home'
              onClick={() => {
                handleMenuClick(PageType.CHANNEL_GALLERY);
              }}
            >
              <img alt='Home' src='/homeIcon.png' />
            </button>
          </div>
          <div className='menu_button' role='button'>
            <button
              aria-label='Conversations'
              onClick={() => {
                handleMenuClick(PageType.CONVERSATIONS);
              }}
            >
              <img alt='Messages' src='/messageIcon.png' />
            </button>
          </div>
          <div className='menu_button' role='button'>
            <button
              aria-label='Settings'
              onClick={() => {
                handleMenuClick(PageType.SETTINGS);
              }}
            >
              <img alt='Settings' src='/settingsIcon.png' />
            </button>
          </div>
          <div className='menu_button' role='button'>
            <button onClick={() => logout()}>
              <svg
                width={24}
                aria-hidden='true'
                fill='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  clipRule='evenodd'
                  d='M12 2.25a.75.75 0 01.75.75v9a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM6.166 5.106a.75.75 0 010 1.06 8.25 8.25 0 1011.668 0 .75.75 0 111.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 011.06 0z'
                  fillRule='evenodd'
                />
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {currentState.currentPage === PageType.CONVERSATIONS && (
        <div className='menu_container members_container'>
          <div className='members_content'>
            <h3>Members</h3>
            <div className='members_list'>
              {members.map((member) => (
                <div key={member.id} className='members_member'>
                  <img
                    alt='avatar'
                    className='members_avatar'
                    src={
                      BASE_URL + '/api/files/users/' +
                      member.id +
                      '/' +
                      member.avatar
                    }
                  />
                  <p>{member.username}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default SideMenu;
