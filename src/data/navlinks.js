

export const navlinks = [
  { title: "Home", label: "home", path: "/" },
  { title: "Contact", label: "contact", path: "/contact" },
  {
    title: "Legal", label: "legal", path: "/legal", children: [
      { title: "Privacy Policy", label: "privacy policy", path: "/legal/privacy-policy", description: "Cookie, storage and data policies" },
      { title: "Terms And Conditions", label: "terms and conditions", path: "/legal/terms-and-conditions", description: "Terms of use for our website and services" },
    ]
  },
];

export default navlinks;