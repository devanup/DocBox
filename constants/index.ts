export const userAvatar = '/images/avatar.png';
// 'https://cdn.vectorstock.com/i/500p/08/19/gray-photo-placeholder-icon-design-ui-vector-35850819.jpg';

export const navItems = [
	{
		label: 'Dashboard',
		icon: '/icons/dashboard.svg',
		url: '/',
	},
	{
		label: 'Documents',
		icon: '/icons/documents.svg',
		url: '/documents',
	},
	{
		label: 'Images',
		icon: '/icons/images.svg',
		url: '/images',
	},
	{
		label: 'Media',
		icon: '/icons/video.svg',
		url: '/media',
	},
	{
		label: 'Others',
		icon: '/icons/others.svg',
		url: '/others',
	},
];

export const actionsDropdownItems = [
	{
		label: 'Rename',
		icon: '/icons/edit.svg',
		value: 'rename',
	},
	{
		label: 'Details',
		icon: '/icons/info.svg',
		value: 'details',
	},
	{
		label: 'Share',
		icon: '/icons/share.svg',
		value: 'share',
	},
	{
		label: 'Download',
		icon: '/icons/download.svg',
		value: 'download',
	},
	{
		label: 'Delete',
		icon: '/icons/delete.svg',
		value: 'delete',
	},
];

export const sortTypes = [
	{
		label: 'Date created (newest)',
		value: '$createdAt-desc',
	},
	{
		label: 'Created Date (oldest)',
		value: '$createdAt-asc',
	},
	{
		label: 'Name (A-Z)',
		value: 'name-asc',
	},
	{
		label: 'Name (Z-A)',
		value: 'name-desc',
	},
	{
		label: 'Size (Highest)',
		value: 'size-desc',
	},
	{
		label: 'Size (Lowest)',
		value: 'size-asc',
	},
];

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
