export interface Course {
  title: string;
  key: string;
  description: string;
  price: number;
  duration: number;
  slots: number;
  id: number;
  category: string;
}

export const courses: Course[] = [
  {
    title: "Mini Course",
    key: "beginner-diving",
    description:
      "Learn basic diving techniques and inmmerse yourself in the underwater world",
    price: 300000,
    duration: 60,
    slots: 10,
    id: 1,
    category: "non-certified-diver",
  },
  {
    title: "Fun Dive (Day)",
    key: "fun-dive-day",
    description: "Dare a little more by diving deeper and longer",
    price: 300000,
    duration: 120,
    slots: 10,
    id: 2,
    category: "non-certified-diver",
  },
  {
    title: "Fun Dive (Night)",
    key: "fun-dive-night",
    description: "Dive in the open sea and explore the underwater world",
    price: 300000,
    duration: 120,
    slots: 10,
    id: 3,
    category: "non-certified-diver",
  },
  {
    title: "Snorkeling",
    key: "snorkeling",
    description: "Dive in the open sea and explore the underwater world",
    price: 300000,
    duration: 120,
    slots: 10,
    id: 4,
    category: "non-certified-diver",
  },
  {
    title: "Sunken Vessels",
    key: "sunken-vessels",
    description: "Dive in the open sea and explore the underwater world",
    price: 300000,
    duration: 120,
    slots: 10,
    id: 5,
    category: "non-certified-diver",
  },
  {
    title: "Double Dive",
    key: "double-dive",
    description: "Dive in the open sea and explore the underwater world",
    price: 300000,
    duration: 120,
    slots: 10,
    id: 6,
    category: "non-certified-diver",
  },
  {
    title: "Open Water Diver",
    key: "open-water",
    description: "Dive in the open sea and explore the underwater world",
    price: 300000,
    duration: 120,
    slots: 10,
    id: 7,
    category: "certified-diver",
  },
  {
    title: "Advanced Open Water Diver",
    key: "advanced-open-water",
    description: "Dive in the open sea and explore the underwater world",
    price: 300000,
    duration: 120,
    slots: 10,
    id: 8,
    category: "certified-diver",
  },
  {
    title: "Rescue Diver",
    key: "rescue",
    description: "Dive in the open sea and explore the underwater world",
    price: 300000,
    duration: 120,
    slots: 10,
    id: 9,
    category: "certified-diver",
  },
  {
    title: "CPR",
    key: "cpr",
    description: "Dive in the open sea and explore the underwater world",
    price: 300000,
    duration: 120,
    slots: 10,
    id: 10,
    category: "certified-diver",
  },
  {
    title: "Divemaster",
    key: "rescue",
    description: "Dive in the open sea and explore the underwater world",
    price: 300000,
    duration: 120,
    slots: 10,
    id: 11,
    category: "certified-diver",
  },
];

export interface BoatI {
  name: string;
  seats: number;
  category: string;
  available: boolean;
}

export const boats: BoatI[] = [
  {
    name: "Boat 1",
    seats: 10,
    category: "boat",
    available: true,
  },
  {
    name: "Boat 2",
    seats: 10,
    category: "boat",
    available: true,
  },
];
