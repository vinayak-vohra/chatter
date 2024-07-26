import { useEffect } from "react";
import { usePageStore } from "../../../context/page.slice";
import ViewContainer from "../ViewContainer";

export default function Chats() {
  const setPage = usePageStore((state) => state.setPage);
  useEffect(() => {
    setPage("Chats");
  }, []);
  return <ViewContainer title="Chats" />;
}
