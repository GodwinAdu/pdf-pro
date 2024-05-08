import { people01, people02, people03, send, shield, star } from "@/public/assets";

export const features = [
  {
    id: "feature-1",
    icon: '/assets/star.svg',
    title: "Student Companion",
    content:
      "We offer Students outstanding library books,practise multiple quizes and more",
  },
  {
    id: "feature-2",
    icon: '/assets/shield.svg',
    title: "Your Assistant",
    content:
      "Professionals to help your in Research work,Nursing care study and more.",
  },
  {
    id: "feature-3",
    icon: '/assets/send.svg',
    title: "Chat with AI",
    content:
      "Our AI provide support with answering question, helping in improving your studies.",
  },
];

export const feedback = [
  {
    id: "feedback-1",
    content:
      "Money is only a tool. It will take you wherever you wish, but it will not replace you as the driver.",
    name: "Herman Jensen",
    title: "Founder & Leader",
    img: people01,
  },
  {
    id: "feedback-2",
    content:
      "Money makes your life easier. If you're lucky to have it, you're lucky.",
    name: "Steve Mark",
    title: "Founder & Leader",
    img: people02,
  },
  {
    id: "feedback-3",
    content:
      "It is usually people in the money business, finance, and international trade that are really rich.",
    name: "Kenn Gallagher",
    title: "Founder & Leader",
    img: people03,
  },
];

export const stats = [
  {
    id: "stats-1",
    title: "User Active",
    value: "3800+",
  },
  {
    id: "stats-2",
    title: "Trusted by Company",
    value: "230+",
  },
  {
    id: "stats-3",
    title: "Transaction",
    value: "$230M+",
  },
];


export const projectDefaultValues = {
  fullname: "",
  email: "",
  phone: "",
  question: "",
  description: "",
  problemType: "",
  deadline: new Date()
}
