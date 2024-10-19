/* eslint-disable no-unused-vars */
import { Document } from 'mongoose';
import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { Server, Member, Profile } from "@prisma/client"


// interface userProps extends Document {
//     userId: string;
//     name: string;
//     imageUrl: string;
//     email: string;
//     createdAt?: Date;  // Optional due to the default value.
//     updatedAt?: Date;  // Optional due to the default value.
//   }
 enum ChannelType {
  TEXT = 'TEXT',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO'
}

// interface channelProps extends Document {
//   name: string;
//   type: ChannelType;
//   profileId: string | Document;  // If you populate this field with a full User document, it would be a Document type. If not, it's just a string (ObjectId).
//   createdAt?: Date;  // The '?' denotes this field as optional since it has a default value.
//   updatedAt?: Date;  // Same reasoning as above.
// }
 enum MemberRole {
    ADMIN = 'ADMIN',
    MODERATOR = 'MODERATOR',
    GUEST = 'GUEST'
  }
  
//   interface memberProps extends Document {
//     role: MemberRole;
//     profile: string | Document;  // If you populate this field with a full User document, it would be a Document type. If not, it's just a string (ObjectId).
//     server: string | Document;   // Similarly, if you populate this with a full Server document, it's a Document. Otherwise, it's a string (ObjectId).
//     createdAt?: Date;  // Optional because of the default value.
//     updatedAt?: Date;  // Optional because of the default value.
//   }


//   interface serverProps extends Document {
//     name: string;
//     imageUrl: string;
//     inviteCode: string;
//     owner: string | Document;   // If you populate this field with the full User document, then it would be a Document type. Otherwise, it's just a string representing ObjectId.
//     members: (string | Document)[];  // Similarly, depending on whether you populate it with full Member documents or not.
//     channels: (string | Document)[];  // Depending on whether you populate it with full Channel documents or not.
//     createdAt?: Date;  // Optional due to the default value.
//     updatedAt?: Date;  // Optional due to the default value.
//   }


 interface UserProps {
    _id: string;
    userId: string;
    name: string;
    imageUrl: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
 interface ChannelProps {
    _id: string;
    name: string;
    type: 'TEXT' | 'AUDIO' | 'VIDEO';
    profileId: UserProps;
    createdAt: Date;
    updatedAt: Date;
  }
  
 interface MemberProps {
    _id:string;
    role: 'ADMIN' | 'MODERATOR' | 'GUEST';
    profile: UserProps;
    server: populatedServerProps;
    createdAt: Date;
    updatedAt: Date;
  }
  
 interface populatedServerProps {
    _id: string;
    name: string;
    imageUrl: string;
    inviteCode: string;
    owner: UserProps;
    members: MemberProps[];
    channels: ChannelProps[];
    createdAt: Date;
    updatedAt: Date;
  }

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type AccessType = ["room:write"] | ["room:read", "room:presence:write"];

declare type RoomAccesses = Record<string, AccessType>;

declare type UserType = "creator" | "editor" | "viewer";

declare type RoomMetadata = {
  creatorId: string;
  email: string;
  title: string;
};

declare type CreateDocumentParams = {
  userId: string;
  email: string;
};

declare type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  color: string;
  userType?: UserType;
};

declare type ShareDocumentParams = {
  roomId: string;
  email: string;
  userType: UserType;
  updatedBy: User;
};

declare type UserTypeSelectorParams = {
  userType: string;
  setUserType: React.Dispatch<React.SetStateAction<UserType>>;
  onClickHandler?: (value: string) => void;
};

declare type ShareDocumentDialogProps = {
  roomId: string;
  collaborators: User[];
  creatorId: string;
  currentUserType: UserType;
};

declare type HeaderProps = {
  children: React.ReactNode;
  className?: string;
};

declare type CollaboratorProps = {
  roomId: string;
  email: string;
  creatorId: string;
  collaborator: User;
  user: User;
};

declare type CollaborativeRoomProps = {
  roomId: string;
  roomMetadata: RoomMetadata;
  users: User[];
  currentUserType: UserType;
};

declare type AddDocumentBtnProps = {
  userId: string;
  email: string;
};

declare type DeleteModalProps = { roomId: string };

declare type ThreadWrapperProps = { thread: ThreadData<BaseMetadata> };





export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};