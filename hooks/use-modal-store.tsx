import { create } from "zustand";

export type ModalType = 
  | "createServer"
  | "invite"
  | "editServer"
  | "members"
  | "createChannel"
  | "leaveServer"
  | "deleteServer"
  | "deleteChannel"
  | "editChannel"
  | "messageFile"
  | "openCoin"
  | "deleteMessage";

interface ModalData {
  server?: any;
  channel?: any;
  channelType?: any;
  apiUrl?: string;
  query?: Record<string, any>;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
  resetModal: () => void;  // Reset function for modal
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,

  // When opening a modal
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),

  // When closing a modal
  onClose: () => set({ type: null, data: {}, isOpen: false }),

  // Reset the modal state
  resetModal: () => set({ type: null, data: {}, isOpen: false })
}));
