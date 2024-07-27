import { useNavigate } from "react-router-dom";
import {
  FaComments,
  FaMagnifyingGlass,
  FaRightFromBracket,
  FaUserGroup,
} from "react-icons/fa6";
import { toast } from "sonner";

import logo from "../../assets/logo.svg";

import NavButton from "../buttons/NavButton";
import { auth } from "../../config/firebase";
import { useAppStore } from "../../context";
import { Pages } from "../../types/Pages";
import { usePageStore } from "../../context/page.slice";
import React from "react";

type Tabs =
  | "divider"
  | "spacer"
  | {
      page: Pages;
      renderIcon: (src: string) => JSX.Element;
      link: string;
    };

const tabs: Tabs[] = [
  {
    page: "Chats",
    renderIcon: () => <FaComments size={16} className="text-neutral" />,
    link: "/chats",
  },
  {
    page: "Groups",
    renderIcon: () => <FaUserGroup size={16} className="text-neutral" />,
    link: "/groups",
  },
  {
    page: "Search",
    renderIcon: () => <FaMagnifyingGlass size={16} className="text-neutral" />,
    link: "/search",
  },
  "divider",
  "spacer",
  "divider",
  {
    page: "Profile",
    renderIcon: (src: string) => (
      <img src={src} alt="user" className="rounded-full p-1" />
    ),
    link: "/profile",
  },
];

export default function SideNav() {
  const user = useAppStore((state) => state.user);
  const page = usePageStore((state) => state.page);

  const nav = useNavigate();

  return (
    <div className=" w-12 h-dvh gap-2 p-2 py-5 flex flex-col items-center">
      <img src={logo} />
      <div className="mt-5" />
      {tabs.map((tab, i) => (
        <React.Fragment key={i}>
          {tab === "spacer" && <div className="mt-auto" />}
          {tab === "divider" && <div className="divider m-0" />}
          {typeof tab === "object" && (
            <span
              className="tooltip tooltip-right tooltip-accent"
              data-tip={tab.page}
            >
              <NavButton
                selected={page === tab.page}
                onClick={() => nav(tab.link)}
              >
                {tab.renderIcon(user?.photoURL || "")}
              </NavButton>
            </span>
          )}
        </React.Fragment>
      ))}

      <span className="tooltip tooltip-right tooltip-accent" data-tip="Logout">
        <NavButton
          onClick={async () => {
            await auth.signOut();
            toast.success("Logged out");
          }}
        >
          <FaRightFromBracket size={16} className="text-error" />
        </NavButton>
      </span>
    </div>
  );
}
