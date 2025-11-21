import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import axiosInstance from 'src/config-global';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from 'src/recoil/auth';

// ----------------------------------------------------------------------

type NotificationItemProps = {
  id: string;
  type: string;
  title: string;
  isRead: boolean;
  description: string;
  avatarUrl: string | null;
  postedAt: string | number | null;
  tiketId: string | null;
};

export type NotificationsPopoverProps = IconButtonProps & {
  data?: NotificationItemProps[];
};

export function NotificationsPopover({ sx, ...other }: NotificationsPopoverProps) {
  // const [notifications, setNotifications] = useState(data);
  const [totalUnRead, setTotalUnRead] = useState(0);
  // const totalUnRead = notifications.filter((item) => item.isRead === true).length;
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [notifications, setNotifications] = useState<NotificationItemProps[]>([]);
  const { user } = useRecoilValue(authState);
  const roleName = user?.role.name;
  const loggedUserId = user?.id;

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const payload = {
          userId: loggedUserId,
        };
        const response = await axiosInstance.post(
          'insurance-escalation/getNotificationForDashboard',
          payload
        );
        const data = response.data.data;
        const mappedData = data.map((notification: any) => ({
          id: notification.id,
          type: notification.type,
          title: notification.title,
          isRead: notification.is_read ? true : false,
          description: notification.message,
          postedAt: notification.sentAt,
          avatarUrl: '/assets/icons/notification/ic-notification-chat.svg',
          tiketId: notification.ticket_id,
        }));
        setNotifications(mappedData);
        const totalUnreadMessage = mappedData.filter((item: any) => !item.isRead).length;
        setTotalUnRead(totalUnreadMessage);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
    };
    fetchNotification();
  }, []);
  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      const payload = {
        userId: loggedUserId,
      };
      const response = await axiosInstance.post(
        'insurance-escalation/markAllReadNotification',
        payload
      );

      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }));

      setNotifications(updatedNotifications);
      setTotalUnRead(0);
    } catch (error) {
      console.error('Failed to mark notifications as read', error);
    }
  }, [notifications]);

  return (
    <>
      <IconButton
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <Box display="flex" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="solar:check-read-outline" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar fillContent sx={{ minHeight: 240, maxHeight: { xs: 360, sm: 'none' } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                New
              </ListSubheader>
            }
          >
            {notifications.slice(0, 3).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                Earlier
              </ListSubheader>
            }
          >
            {notifications.slice(3, 100).map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </List>
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple color="inherit">
            View all
          </Button>
        </Box>
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

function NotificationItem({ notification }: { notification: NotificationItemProps }) {
  const { avatarUrl, title } = renderContent(notification);
  const navigate = useNavigate();
  // console.log('in noti function isss----------', notification.isRead);
  const handleViewTicket = (ticketId: any) => {
    navigate(`/ticket-detail/${ticketId}`);
  };
  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(!notification.isRead && {
          bgcolor: 'action.selected',
        }),
      }}
      // onClick={() => handleViewTicket(notification.id)}
      onClick={() => handleViewTicket(notification?.tiketId)}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatarUrl}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              gap: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify width={14} icon="solar:clock-circle-outline" />
            {fToNow(notification.postedAt)}
          </Typography>
        }
      />
    </ListItemButton>
  );
}

// ----------------------------------------------------------------------
// this code is not in use
function renderContent(notification: NotificationItemProps) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        &nbsp; {notification.description}
      </Typography>
    </Typography>
  );
console.log("here is testing--", notification);
  if (notification.type === 'order-placed') {
    return {
      avatarUrl: (
        <img
          alt={notification.title}
          src="/assets/icons/notification/ic-notification-package.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'order-shipped') {
    return {
      avatarUrl: (
        <img
          alt={notification.title}
          src="/assets/icons/notification/ic-notification-shipping.svg"
        />
      ),
      title,
    };
  }
  if (notification.type === 'mail') {
    return {
      avatarUrl: (
        <img alt={notification.title} src="/assets/icons/notification/ic-notification-mail.svg" />
      ),
      title,
    };
  }
  if (notification.type === 'chat-message') {
    return {
      avatarUrl: (
        <img alt={notification.title} src="/assets/icons/notification/ic-notification-chat.svg" />
      ),
      title,
    };
  }
  return {
    avatarUrl: notification.avatarUrl ? (
      <img alt={notification.title} src={notification.avatarUrl} />
    ) : null,
    title,
  };
}
