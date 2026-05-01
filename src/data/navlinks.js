

export const navlinks = [
  { title: "Home", label: "Home", path: "/" },
  { title: "Contact", label: "Contact", path: "/contact" },
  { title: "Pricing", label: "Pricing", path: "/pricing" },
  {
    title: "Legal", label: "Legal", path: "/legal", children: [
      { title: "Privacy Policy", label: "Privacy Policy", path: "/legal/privacy-policy", description: "Cookie, storage and data policies" },
      { title: "Terms And Conditions", label: "Terms and Conditions", path: "/legal/terms-and-conditions", description: "Terms of use for our website and services" },
    ]
  },
];

export default navlinks;