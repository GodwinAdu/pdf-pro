"use client"

import { Tab } from '@/components/common/Tab';
import { Tabs } from '@/components/common/Tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GetServerSideProps } from 'next';
import { FC, useState } from 'react';
import { FiMail, FiPhone, FiUser, FiLock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface UserDetailProps {
    user: IUser;
}

const UserDetail: FC<UserDetailProps> = ({ user }) => {
    const [selectedTab, setSelectedTab] = useState('profile');

    return (
        <div className="container mx-auto p-6">
            {/* User Profile Header */}
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 flex items-center space-x-6">
                <img
                    className="w-20 h-20 rounded-full object-cover"
                    src={user.imageUrl || '/default-avatar.png'}
                    alt={user.fullName}
                />
                <div>
                    <h1 className="text-2xl font-bold dark:text-white">{user.fullName}</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        @{user.username} &middot; {user.email}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                        <Button size="sm" variant="outline">
                            Edit User
                        </Button>
                        <Button size="sm" className='bg-red-500 hover:bg-red-700'>
                            Delete User
                        </Button>
                       
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <Tabs selectedTab={selectedTab} onSelect={setSelectedTab}>
                <Tab label="Profile" value="profile">
                    <ProfileTab user={user} />
                </Tab>
                <Tab label="Metadata" value="metadata">
                    <MetadataTab user={user} />
                </Tab>
                <Tab label="Account Status" value="account">
                    <AccountStatusTab user={user} />
                </Tab>
                <Tab label="Permissions" value="permissions">
                    <PermissionsTab user={user} />
                </Tab>
            </Tabs>
        </div>
    );
};

// Profile Tab
const ProfileTab: FC<{ user: IUser }> = ({ user }) => (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 space-y-6">
        <Card title="Basic Information" icon={<FiUser />}>
            <div className="space-y-6">
                <p><strong>Full Name:</strong> {user.fullName}</p>
                <p><strong>Username:</strong> @{user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
                <p><strong>Referral Code:</strong> {user.referralCode || 'N/A'}</p>
            </div>
        </Card>

        <Card title="Team Members" icon={<FiMail />}>
            {user.teamMembers?.length > 0 ? (
                <ul className="space-y-2">
                    {user.teamMembers.map((member) => (
                        <li key={member._id} className="text-gray-700 dark:text-gray-300">
                            {member.fullName} (@{member.username})
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No team members</p>
            )}
        </Card>
    </div>
);

// Metadata Tab
const MetadataTab: FC<{ user: IUser }> = ({ user }) => (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Login Info" icon={<FiLock />}>
            <div className="space-y-5">
                <p><strong>Last Login:</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</p>
                <p><strong>Login Attempts:</strong> {user.loginAttempts}</p>
            </div>
        </Card>

        <Card title="Browser Info" icon={<FiCheckCircle />}>
            <div className="space-y-5">
                <p><strong>Browser:</strong> {user.metadata?.browser || 'Unknown'}</p>
                <p><strong>Device:</strong> {user.metadata?.device || 'Unknown'}</p>
                <p><strong>Location:</strong> {user.metadata?.location || 'Unknown'}</p>
            </div>
        </Card>
    </div>
);

// Account Status Tab
const AccountStatusTab: FC<{ user: IUser }> = ({ user }) => (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Verification" icon={<FiCheckCircle />}>
            <div className="space-y-5">
                <p><strong>Email Verified:</strong> <Badge className={`ml-8 ${user.emailVerified ? "bg-green-500 hover:bg-green-700 " : "bg-yellow-500 hover:bg-yellow-700"}`}>{user.emailVerified ? 'verified' : 'unverified'}</Badge></p>
                <p><strong>Phone Verified:</strong> <Badge className={`ml-8 ${user.phoneVerified ? "bg-green-500 hover:bg-green-700 " : "bg-yellow-500 hover:bg-yellow-700"}`}>{user.phoneVerified ? 'verified' : 'unverified'}</Badge></p>
            </div>
        </Card>

        <Card title="Account Status" icon={<FiXCircle />}>
            <div className="space-y-5">
                <p><strong>Account Locked:</strong> <Badge className={`${!user.accountLocked ? "bg-green-500 hover:bg-green-700 " : "bg-red-500 hover:bg-red-700"}`}>{user.accountLocked ? 'Yes' : 'No'}</Badge></p>
                <p><strong>Is Banned:</strong> <Badge className={`${!user.isBanned ? "bg-green-500 hover:bg-green-700 " : "bg-red-500 hover:bg-red-700"}`}>{user.isBanned ? 'Yes' : 'No'}</Badge></p>
                <p><strong>Is Deleted:</strong> <Badge className={`${!user.isDeleted ? "bg-green-500 hover:bg-green-700 " : "bg-red-500 hover:bg-red-700"}`}>{user.isDeleted ? 'Yes' : 'No'}</Badge></p>
            </div>
        </Card>
    </div>
);

// Permissions Tab
const PermissionsTab: FC<{ user: IUser }> = ({ user }) => (
    <div className="mt-6">
        <Card title="User Permissions" icon={<FiLock />}>
            <p><strong>Delete Account:</strong> <Badge className={`${user.permissions.deleteAccount ? "bg-green-500 hover:bg-green-700 " : "bg-red-500 hover:bg-red-700"}`}>{user.permissions.deleteAccount ? 'Allowed' : 'Not Allowed'}</Badge></p>
        </Card>
    </div>
);

// Card Component
const Card: FC<{ title: string, icon?: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
        <div className="flex items-center mb-4">
            {icon && <span className="mr-2 text-gray-500 dark:text-gray-300">{icon}</span>}
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
        </div>
        {children}
    </div>
);



export default UserDetail;
