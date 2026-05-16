import {
  Home,
  PeopleAlt,
  ViewCarousel,
  WorkOutline,
  FormatQuote,
  MenuBook,
  Info,
  Gavel,
  Security,
  Build,
  Work,
  Article,
  PhotoLibrary,
  ContactMail,
} from "@mui/icons-material";

export const menu = [
  {
    id: 1,
    label: "Home",
    icon: Home,
    path: "/dashboard",
  },

  {
    id: 7,
    label: "Banners",
    path: "/banner",
    icon: ViewCarousel,
  },

  {
    id: 5,
    label: "Client",
    path: "/client/list",
    icon: PeopleAlt,
  },

  {
    id: 17,
    label: "Work",
    path: "/work/list",
    icon: WorkOutline,
  },

  {
    id: 18,
    label: "Testimonial",
    path: "/testimonial/list",
    icon: FormatQuote,
  },

  {
    id: 8,
    label: "Pages",
    icon: MenuBook,
    children: [
      {
        id: 25,
        label: "About",
        path: "/about/list",
        icon: Info,
      },
      {
        id: 26,
        label: "Terms",
        path: "/terms/list",
        icon: Gavel,
      },
      {
        id: 27,
        label: "Privacy",
        path: "/privacy/list",
        icon: Security,
      },
      {
        id: 28,
        label: "Services",
        path: "/service/list",
        icon: Build,
      },
      {
        id: 29,
        label: "Careers",
        path: "/career/list",
        icon: Work,
      },
    ],
  },

  {
    id: 11,
    label: "Our Blogs",
    path: "/blog/list",
    icon: Article,
  },

  {
    id: 12,
    label: "Gallery",
    path: "/gallery/list",
    icon: PhotoLibrary,
  },

  {
    id: 13,
    label: "Enquiry",
    path: "/enquiry/list",
    icon: ContactMail,
  },
];
