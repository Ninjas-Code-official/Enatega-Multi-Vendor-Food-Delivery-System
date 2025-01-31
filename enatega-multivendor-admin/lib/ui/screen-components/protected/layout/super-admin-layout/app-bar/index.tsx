/* eslint-disable @next/next/no-img-element */
'use client';

// Core
import { usePathname, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Icons
import {
  faBell,
  faChevronDown,
  faEllipsisV,
  faMap,
  faTruck,
  faRightFromBracket,
  faBars,
  faGlobe,
  faFaceFrown,
} from '@fortawesome/free-solid-svg-icons';

// UI Components
import TextIconClickable from '@/lib/ui/useable-components/text-icon-clickable';
import CustomDialog from '@/lib/ui/useable-components/delete-dialog';

// Prime Reat
import { Menu } from 'primereact/menu';
import { Skeleton } from 'primereact/skeleton';

// Layout
import { LayoutContext } from '@/lib/context/global/layout.context';

// Hooks
import { useUserContext } from '@/lib/hooks/useUser';

// Interface/Types
import { LayoutContextProps } from '@/lib/utils/interfaces';
import { IWebNotification } from '@/lib/utils/interfaces/notification.interface';

// Constants
import {
  APP_NAME,
  SELECTED_RESTAURANT,
  SELECTED_VENDOR,
  SELECTED_VENDOR_EMAIL,
} from '@/lib/utils/constants';

// Methods
import { onUseLocalStorage } from '@/lib/utils/methods';
import { timeAgo } from '@/lib/utils/methods/timeAgo';

// Styles
import classes from './app-bar.module.css';
import { AppLogo } from '@/lib/utils/assets/svgs/logo';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@/lib/utils/types/locale';
import { setUserLocale } from '@/lib/utils/methods/locale';

// GraphQL
import { useMutation, useQuery, useSubscription } from '@apollo/client';
import { RIDER_UPDATED_SUBSCRIPTION } from '@/lib/api/graphql/subscription/rider-subscription';
import {
  GET_WEB_NOTIFICATIONS,
  MARK_WEB_NOTIFICATIONS_AS_READ,
} from '@/lib/api/graphql';

const AppTopbar = () => {
  // States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNtfnOpen, setIsNtfnOpen] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false); // New state for the modal
  const [notifications, setNotifications] = useState<IWebNotification[]>([]);

  // Hooks
  const t = useTranslations();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const currentLocale = useLocale();

  // Ref
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<Menu>(null);
  const ntfnDropdownRef = useRef<HTMLDivElement>(null);
  const languageMenuRef = useRef<Menu>(null);

  // Context
  const { showSuperAdminSidebar } =
    useContext<LayoutContextProps>(LayoutContext);
  const { user, setUser } = useUserContext();

  // Query
  const { loading, refetch } = useQuery(GET_WEB_NOTIFICATIONS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      setNotifications(data?.webNotifications);
    },
  });

  // Subscriptions
  useSubscription(RIDER_UPDATED_SUBSCRIPTION, {
    fetchPolicy: 'network-only',
    onData: async () => {
      const result = await refetch();
      setNotifications(result?.data?.webNotifications);
    },
  });

  // Mutation
  const [markAllAsRead] = useMutation(MARK_WEB_NOTIFICATIONS_AS_READ, {
    refetchQueries: [{ query: GET_WEB_NOTIFICATIONS }],
    onCompleted: (data) => {
      setNotifications(data?.markWebNotificationsAsRead);
    },
  });

  // Handlers
  const toggleDropdown = () => {
    markAllAsRead();
    setIsNtfnOpen(!isNtfnOpen);
  };

  const onDevicePixelRatioChange = useCallback(() => {
    setIsMenuOpen(false);
    showSuperAdminSidebar(false);
  }, [showSuperAdminSidebar]);

  const shouldShow = (permission: string) => {
    if (user && user.userType === 'STAFF') {
      return user?.permissions?.includes(permission);
    } else return true;
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsMenuOpen(false);
    }
  };

  const onRedirectToPage = (_route: string) => {
    router.push(_route);
  };

  const onConfirmLogout = () => {
    setUser(null);
    onUseLocalStorage('delete', SELECTED_VENDOR);
    onUseLocalStorage('delete', SELECTED_VENDOR_EMAIL);
    onUseLocalStorage('delete', SELECTED_RESTAURANT);
    onUseLocalStorage('delete', `user-${APP_NAME}`);
    router.push('/authentication/login');
  };

  function onLocaleChange(value: string) {
    const locale = value as TLocale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  // Use Effects
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', onDevicePixelRatioChange);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', onDevicePixelRatioChange);
    };
  }, [onDevicePixelRatioChange]);

  useEffect(() => {
    const ntfnClickOutside = (event: MouseEvent) => {
      // Close the dropdown if the click is outside the dropdown
      if (
        ntfnDropdownRef.current &&
        !ntfnDropdownRef.current.contains(event.target as Node)
      ) {
        setIsNtfnOpen(false);
      }
    };

    if (isNtfnOpen) {
      document.addEventListener('mousedown', ntfnClickOutside);
    } else {
      document.removeEventListener('mousedown', ntfnClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', ntfnClickOutside);
    };
  }, [isNtfnOpen]);

  return (
    <div className={`${classes['layout-topbar']}`}>
      <div className="flex items-center cursor-pointer">
        <div id="sidebar-opening-icon">
          <button onClick={() => showSuperAdminSidebar()}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
        <div onClick={() => onRedirectToPage('/home')}>
          <AppLogo />
        </div>
      </div>
      <div className="hidden items-center space-x-5 md:flex">
        {shouldShow('Zone') && (
          <TextIconClickable
            icon={faMap}
            title={t('Zone')}
            className={
              pathname === '/zone'
                ? 'rounded bg-primary-color text-white'
                : 'bg-transparent hover:rounded hover:bg-secondary-color'
            }
            iconStyles={{
              color: pathname === '/zone' ? 'white' : 'gray',
            }}
            onClick={() => onRedirectToPage('/zone')}
          />
        )}
        {shouldShow('Dispatch') && (
          <TextIconClickable
            icon={faTruck}
            title={t('Dispatch')}
            className={
              pathname === '/dispatch'
                ? 'rounded bg-primary-color text-white'
                : 'bg-transparent hover:rounded hover:bg-secondary-color'
            }
            iconStyles={{ color: pathname === '/dispatch' ? 'white' : 'gray' }}
            onClick={() => onRedirectToPage('/dispatch')}
          />
        )}
        <div className="relative z-50">
          <FontAwesomeIcon
            icon={faBell}
            className="cursor-pointer text-gray-600 hover:text-black"
            onClick={toggleDropdown}
          />
          {!loading &&
            notifications?.filter((ntfn) => !ntfn.read).length > 0 && (
              <span className="absolute text-xs top-[-4px] right-[-8px] w-4 h-4 flex justify-center items-center rounded-full bg-red-500 text-white">
                {notifications?.filter((ntfn) => !ntfn.read).length}
              </span>
            )}

          {isNtfnOpen && (
            <div
              ref={ntfnDropdownRef}
              className="absolute flex select-none flex-col pb-2 top-5 right-0 mt-2 w-72 bg-white shadow-xl rounded-md border"
            >
              <p className="select-none text-center font-medium p-2 shadow-sm">
                Notifications
              </p>

              <ul className="flex flex-col gap-1 pt-2 overflow-y-auto max-h-[368px]">
                {/* If loading, show skeleton loaders */}
                {loading ? (
                  [1, 2, 3].map((_, index) => (
                    <div className="px-3" key={index}>
                      <Skeleton width="100%" height="52px" className="px-2" />
                    </div>
                  ))
                ) : notifications.length === 0 ? (
                  <div className="flex p-2 gap-2 justify-center items-center">
                    <li className="text-center text-gray-500">
                      No notifications yet
                    </li>
                    <FontAwesomeIcon
                      icon={faFaceFrown}
                      color="gray"
                      onClick={() =>
                        onRedirectToPage('/management/notifications')
                      }
                    />
                  </div>
                ) : (
                  notifications?.map((notification, index) => (
                    <Link
                      key={index}
                      className={`p-2 mx-3 rounded-md text-sm cursor-pointer ${
                        notification.read
                          ? 'text-black'
                          : 'text-[#484848] bg-[#d8e3a369]'
                      } hover:bg-gray-300`}
                      href={`${notification.navigateTo}`}
                      onClick={() => {
                        markAllAsRead();
                        setIsNtfnOpen(false);
                      }}
                    >
                      <p>{notification.body}</p>
                      <p className="text-xs text-gray-400">
                        {timeAgo(+notification.createdAt)}
                      </p>
                    </Link>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="hidden items-center space-x-3 md:flex">
          <div
            className="flex items-center space-x-2 rounded-md p-2 hover:bg-[#d8d8d837]"
            onClick={(event) => languageMenuRef.current?.toggle(event)}
            aria-controls="popup_menu_right"
            aria-haspopup
          >
            <FontAwesomeIcon icon={faGlobe} />

            <Menu
              model={[
                {
                  label: 'ENGLISH',
                  template(item) {
                    return (
                      <div
                        className={`${currentLocale === 'en' ? 'bg-[#b1c748]' : ''} p-2  cursor-pointer`}
                        onClick={() => onLocaleChange('en')}
                      >
                        {item.label}
                      </div>
                    );
                  },
                  command: () => {
                    onLocaleChange('en');
                  },
                },
                {
                  label: 'ARABIC',
                  template(item) {
                    return (
                      <div
                        className={`${currentLocale === 'ar' ? 'bg-[#b1c748]' : ''} p-2  cursor-pointer`}
                        onClick={() => onLocaleChange('ar')}
                      >
                        {item.label}
                      </div>
                    );
                  },
                  command: () => {
                    onLocaleChange('ar');
                  },
                },
                {
                  label: 'FRENCH',
                  template(item) {
                    return (
                      <div
                        className={`${currentLocale === 'fr' ? 'bg-[#b1c748]' : ''} p-2  cursor-pointer`}
                        onClick={() => onLocaleChange('fr')}
                      >
                        {item.label}
                      </div>
                    );
                  },
                  command: () => {
                    onLocaleChange('fr');
                  },
                },
                {
                  label: 'KHMER',
                  template(item) {
                    return (
                      <div
                        className={`${currentLocale === 'km' ? 'bg-[#b1c748]' : ''} p-2  cursor-pointer`}
                        onClick={() => onLocaleChange('km')}
                      >
                        {item.label}
                      </div>
                    );
                  },
                  command: () => {
                    onLocaleChange('km');
                  },
                },
                {
                  label: 'CHINESE',
                  template(item) {
                    return (
                      <div
                        className={`${currentLocale === 'zh' ? 'bg-[#b1c748]' : ''} p-2  cursor-pointer`}
                        onClick={() => onLocaleChange('zh')}
                      >
                        {item.label}
                      </div>
                    );
                  },
                  command: () => {
                    onLocaleChange('zh');
                  },
                },
                {
                  label: 'HEBREW',
                  template(item) {
                    return (
                      <div
                        className={`${currentLocale === 'he' ? 'bg-[#b1c748]' : ''} p-2  cursor-pointer`}
                        onClick={() => onLocaleChange('he')}
                      >
                        {item.label}
                      </div>
                    );
                  },
                  command: () => {
                    onLocaleChange('he');
                  },
                },
              ]}
              popup
              ref={languageMenuRef}
              id="popup_menu_right"
              popupAlignment="right"
            />
          </div>

          <div
            className="flex items-center space-x-2 rounded-md p-2 hover:bg-[#d8d8d837]"
            onClick={(event) => menuRef.current?.toggle(event)}
            aria-controls="popup_menu_right"
            aria-haspopup
          >
            <span>{user?.name ?? ''}</span>

            <Image
              src={
                user?.image
                  ? user.image
                  : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
              }
              alt={t('profile-img')}
              height={32}
              width={32}
              className="h-8 w-8 select-none rounded-full"
            />

            <FontAwesomeIcon icon={faChevronDown} />
            <Menu
              model={[
                {
                  label: t('Logout'),
                  command: () => {
                    setLogoutModalVisible(true);
                  },
                },
              ]}
              popup
              ref={menuRef}
              id="popup_menu_right"
              popupAlignment="right"
            />
            <Menu
              model={[
                {
                  label: 'ENGLISH',
                  template(item) {
                    return (
                      <div
                        className={`${currentLocale === 'en' ? 'bg-[#b1c748]' : ''} p-2  cursor-pointer`}
                        onClick={() => onLocaleChange('en')}
                      >
                        {item.label}
                      </div>
                    );
                  },
                  command: () => {
                    onLocaleChange('en');
                  },
                },
                {
                  label: 'ARABIC',
                  template(item) {
                    return (
                      <div
                        className={`${currentLocale === 'ar' ? 'bg-[#b1c748]' : ''} p-2  cursor-pointer`}
                        onClick={() => onLocaleChange('ar')}
                      >
                        {item.label}
                      </div>
                    );
                  },
                  command: () => {
                    onLocaleChange('ar');
                  },
                },
                {
                  label: 'FRENCH',
                  template(item) {
                    return (
                      <div
                        className={`${currentLocale === 'fr' ? 'bg-[#b1c748]' : ''} p-2  cursor-pointer`}
                        onClick={() => onLocaleChange('fr')}
                      >
                        {item.label}
                      </div>
                    );
                  },
                  command: () => {
                    onLocaleChange('fr');
                  },
                },
                {
                  label: 'KHMER',
                  template(item) {
                    return (
                      <div
                        className={`${currentLocale === 'km' ? 'bg-[#b1c748]' : ''} p-2  cursor-pointer`}
                        onClick={() => onLocaleChange('km')}
                      >
                        {item.label}
                      </div>
                    );
                  },
                  command: () => {
                    onLocaleChange('km');
                  },
                },
                {
                  label: 'CHINESE',
                  template(item) {
                    return (
                      <div
                        className={`${currentLocale === 'zh' ? 'bg-[#b1c748]' : ''} p-2  cursor-pointer`}
                        onClick={() => onLocaleChange('zh')}
                      >
                        {item.label}
                      </div>
                    );
                  },
                  command: () => {
                    onLocaleChange('zh');
                  },
                },
                {
                  label: 'HEBREW',
                  template(item) {
                    return (
                      <div
                        className={`${currentLocale === 'he' ? 'bg-[#b1c748]' : ''} p-2  cursor-pointer`}
                        onClick={() => onLocaleChange('he')}
                      >
                        {item.label}
                      </div>
                    );
                  },
                  command: () => {
                    onLocaleChange('he');
                  },
                },
              ]}
              popup
              ref={languageMenuRef}
              id="popup_menu_right"
              popupAlignment="right"
            />
          </div>
        </div>
      </div>

      <div className="flex md:hidden space-x-3">
        <div
          className="rounded-md p-2 hover:bg-[#d8d8d837]"
          onClick={(event) => languageMenuRef.current?.toggle(event)}
          aria-controls="popup_menu_right"
          aria-haspopup
        >
          <FontAwesomeIcon icon={faGlobe} />

          <Menu
            model={[
              {
                label: 'ENGLISH',
                template(item) {
                  return (
                    <div
                      className={`${currentLocale === 'en' ? 'bg-[#b1c748]' : ''} p-2  cursor-pointer`}
                      onClick={() => onLocaleChange('en')}
                    >
                      {item.label}
                    </div>
                  );
                },
                command: () => {
                  onLocaleChange('en');
                },
              },
              {
                label: 'ARABIC',
                template(item) {
                  return (
                    <div
                      className={`${currentLocale === 'ar' ? 'bg-[#b1c748]' : ''} p-2  cursor-pointer`}
                      onClick={() => onLocaleChange('ar')}
                    >
                      {item.label}
                    </div>
                  );
                },
                command: () => {
                  onLocaleChange('ar');
                },
              },
              {
                label: 'FRENCH',
                template(item) {
                  return (
                    <div
                      className={`${currentLocale === 'fr' ? 'bg-[#b1c748]' : ''} p-2  cursor-pointer`}
                      onClick={() => onLocaleChange('fr')}
                    >
                      {item.label}
                    </div>
                  );
                },
                command: () => {
                  onLocaleChange('fr');
                },
              },
              {
                label: 'KHMER',
                template(item) {
                  return (
                    <div
                      className={`${currentLocale === 'km' ? 'bg-[#b1c748]' : ''} p-2  cursor-pointer`}
                      onClick={() => onLocaleChange('km')}
                    >
                      {item.label}
                    </div>
                  );
                },
                command: () => {
                  onLocaleChange('km');
                },
              },
              {
                label: 'CHINESE',
                template(item) {
                  return (
                    <div
                      className={`${currentLocale === 'zh' ? 'bg-[#b1c748]' : ''} p-2  cursor-pointer`}
                      onClick={() => onLocaleChange('zh')}
                    >
                      {item.label}
                    </div>
                  );
                },
                command: () => {
                  onLocaleChange('zh');
                },
              },
              {
                label: 'HEBREW',
                template(item) {
                  return (
                    <div
                      className={`${currentLocale === 'he' ? 'bg-[#b1c748]' : ''} p-2  cursor-pointer`}
                      onClick={() => onLocaleChange('he')}
                    >
                      {item.label}
                    </div>
                  );
                },
                command: () => {
                  onLocaleChange('he');
                },
              },
            ]}
            popup
            ref={languageMenuRef}
            id="popup_menu_right"
            popupAlignment="right"
          />
        </div>

        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>
      </div>

      {isMenuOpen && (
        <div
          className="absolute right-4 top-8 z-50 rounded-lg bg-white p-4 shadow-lg"
          ref={containerRef}
        >
          <div className="flex flex-col items-center space-y-4">
            {shouldShow('Notification') && (
              <FontAwesomeIcon
                icon={faBell}
                color="gray"
                onClick={() => onRedirectToPage('/management/notifications')}
              />
            )}
            {shouldShow('Zone') && (
              <TextIconClickable
                className="justify-between"
                icon={faMap}
                onClick={() => onRedirectToPage('/zone')}
              />
            )}
            {shouldShow('Dispatch') && (
              <TextIconClickable
                className="justify-between"
                icon={faTruck}
                onClick={() => onRedirectToPage('/dispatch')}
              />
            )}
            {/* <TextIconClickable className="justify-between" icon={faCog} /> */}
            {/* <TextIconClickable className="justify-between" icon={faGlobe} /> */}
            <TextIconClickable
              className="cursor-pointer"
              icon={faRightFromBracket}
              onClick={() => {
                setLogoutModalVisible(true);
              }}
            />
          </div>
        </div>
      )}
      <CustomDialog
        title={t('Logout Confirmation')}
        message={t('Are you sure you want to logout?')}
        visible={isLogoutModalVisible}
        onHide={() => setLogoutModalVisible(false)}
        onConfirm={onConfirmLogout}
        loading={false} // Set to true if you have a loading state for logout
        buttonConfig={{
          primaryButtonProp: { label: t('Yes'), icon: 'pi pi-check' },
          secondaryButtonProp: { label: t('Cancel'), icon: 'pi pi-times' },
        }}
      />
    </div>
  );
};

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
