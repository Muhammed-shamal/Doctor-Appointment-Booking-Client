// import { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import Box from '@mui/material/Box';
// import List from '@mui/material/List';
// import Badge from '@mui/material/Badge';
// import Button from '@mui/material/Button';
// import Avatar from '@mui/material/Avatar';
// import Divider from '@mui/material/Divider';
// import Tooltip from '@mui/material/Tooltip';
// import Popover from '@mui/material/Popover';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import ListItemText from '@mui/material/ListItemText';
// import ListSubheader from '@mui/material/ListSubheader';
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import ListItemButton from '@mui/material/ListItemButton';
// import { NotificationAdd, PunchClock } from '@mui/icons-material';
// import { FilledInput } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import { v4 as uuidv4 } from 'uuid';
// import Scrollbar from '../scrollbar/scrollbar'
// import socket from '../../api/socket'

// export default function NotificationsPopover() {
//     const navigate = useNavigate()
//     const [notifications, setNotifications] = useState([]);

//     const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

//     const [open, setOpen] = useState(null);

//     // Save to sessionStorage whenever notifications change
//     useEffect(() => {
//         socket.on("stockAlert", (newNotification) => {
//             const newNotif = {
//                 id: uuidv4(),
//                 title: newNotification.title,
//                 description: newNotification.description,
//                 avatar: null,
//                 type: newNotification.type,
//                 createdAt: new Date(newNotification.createdAt),
//                 isUnRead: true,
//             };
    
//             const prev = JSON.parse(sessionStorage.getItem("notifications")) || [];
    
//             const updated = [newNotif, ...prev];
//             sessionStorage.setItem("notifications", JSON.stringify(updated));
//             setNotifications(updated);
//         });
    
//         return () => socket.off("stockAlert");
//     }, []);    


//     const handleOpen = (event) => {
//         setOpen(event.currentTarget);
//     };

//     const handleClose = () => {
//         setOpen(null);
//     };

//     const handleMarkAllAsRead = () => {
//         const updated = notifications.map((notification) => ({
//             ...notification,
//             isUnRead: false,
//         }));
//         setNotifications(updated);
//         sessionStorage.setItem("notifications", JSON.stringify(updated));
//     };
    

//     return (
//         <>
//             <IconButton color={open ? 'primary' : 'default'} onClick={handleOpen}>
//                 <Badge badgeContent={totalUnRead} color="error">
//                     <NotificationAdd />
//                 </Badge>
//             </IconButton>

//             <Popover
//                 open={!!open}
//                 anchorEl={open}
//                 onClose={handleClose}
//                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//                 transformOrigin={{ vertical: 'top', horizontal: 'right' }}
//                 PaperProps={{
//                     sx: {
//                         mt: 1.5,
//                         ml: 0.75,
//                         width: 360,
//                     },
//                 }}
//             >
//                 <Box
//                     sx={{
//                         display: 'flex',
//                         alignItems: 'center',
//                         py: 2,
//                         px: 2.5,
//                         borderBottom: '1px solid',
//                         borderColor: 'divider',
//                         backgroundColor: 'background.default',
//                     }}
//                 >
//                     <Box sx={{ flexGrow: 1 }}>
//                         <Typography variant="subtitle1">Notifications</Typography>
//                         <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//                             You have {totalUnRead} unread messages
//                         </Typography>
//                     </Box>

//                     {totalUnRead > 0 && (
//                         <Tooltip title="Mark all as read">
//                             <IconButton color="primary" onClick={handleMarkAllAsRead}>
//                                 <FilledInput fontSize="small" />
//                             </IconButton>
//                         </Tooltip>
//                     )}
//                 </Box>


//                 <Divider sx={{ borderStyle: 'dashed' }} />

//                 <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
//                     <List
//                         disablePadding
//                         subheader={
//                             <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
//                                 New
//                             </ListSubheader>
//                         }
//                     >
//                         {notifications.slice(0, 5).map((notification) => (
//                             <NotificationItem key={notification.id} notification={notification} />
//                         ))}
//                     </List>

//                     <List
//                         disablePadding
//                         subheader={
//                             <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
//                                 Before that
//                             </ListSubheader>
//                         }
//                     >
//                         {notifications.slice(5, 10).map((notification) => (
//                             <NotificationItem key={notification.id} notification={notification} />
//                         ))}
//                     </List>
//                 </Scrollbar>

//                 <Divider sx={{ borderStyle: 'dashed' }} />

//                 <Box sx={{ p: 1 }}>
//                     <Button fullWidth disableRipple onClick={() => {
//                         navigate('/notifications');
//                         handleClose();
//                     }}>
//                         View All Notifications
//                     </Button>
//                 </Box>

//             </Popover>
//         </>
//     );
// }

// // ----------------------------------------------------------------------

// NotificationItem.propTypes = {
//     notification: PropTypes.shape({
//         createdAt: PropTypes.instanceOf(Date),
//         id: PropTypes.string,
//         isUnRead: PropTypes.bool,
//         title: PropTypes.string,
//         description: PropTypes.string,
//         type: PropTypes.string,
//         avatar: PropTypes.any,
//     }),
// };

// function NotificationItem({ notification }) {
//     const { avatar, title } = renderContent(notification);

//     return (
//         <ListItemButton
//             sx={{
//                 py: 2,
//                 px: 2.5,
//                 mt: 1,
//                 borderRadius: 2,
//                 transition: 'all 0.3s',
//                 boxShadow: notification.isUnRead ? 3 : 0,
//                 bgcolor: notification.isUnRead ? 'background.paper' : 'background.default',
//                 '&:hover': {
//                     boxShadow: 4,
//                     bgcolor: 'action.hover',
//                 },
//             }}
//         >
//             <ListItemAvatar sx={{ minWidth: 44 }}>
//                 <Avatar
//                     sx={{
//                         bgcolor: 'background.neutral',
//                         width: 40,
//                         height: 40,
//                     }}
//                 >
//                     {avatar}
//                 </Avatar>
//             </ListItemAvatar>

//             <ListItemText
//                 primary={title}
//                 secondary={
//                     <Typography
//                         variant="caption"
//                         sx={{
//                             mt: 0.5,
//                             display: 'flex',
//                             alignItems: 'center',
//                             gap: 0.5,
//                             color: 'text.disabled',
//                         }}
//                     >
//                         <PunchClock fontSize="small" />
//                         {notification.createdAt && new Date(notification.createdAt).toLocaleString()}
//                     </Typography>
//                 }
//             />
//         </ListItemButton>
//     );
// }


// // ----------------------------------------------------------------------

// function renderContent(notification) {
//     const title = (
//         <Typography variant="subtitle2">
//             {notification.title}
//             <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
//                 &nbsp; {notification.description}
//             </Typography>
//         </Typography>
//     );

//     if (notification.type === 'low_stock') {
//         return {
//             avatar: <img src="/assets/icons/ic_notification_package.svg" alt="low stock" style={{ width: 24 }} />,
//             title,
//         };
//     }

//     if (notification.type === 'out_of_stock') {
//         return {
//             avatar: <img src="/assets/icons/ic_notification_shipping.svg" alt="out of stock" style={{ width: 24 }} />,
//             title,
//         };
//     }

//     return {
//         avatar: notification.avatar ? <img alt={notification.title} src={notification.avatar} /> : null,
//         title,
//     };
// }
