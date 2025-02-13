// @@@ pwned by 1m4unkn0wn @@@
import { NavigateFunction } from "react-router";
import { Action } from "kbar";
import { TFunction } from "i18next";
import { AdminSidebar } from "~/application/sidebar/AdminSidebar";
import CommandHelper from "./CommandHelper";
import { AppRootData } from "~/utils/data/useRootData";

interface Props {
  t: TFunction;
  navigate: NavigateFunction;
  rootData: AppRootData;
}
function getCommands({ t, navigate, rootData }: Props): Action[] {
  const actions: Action[] = CommandHelper.getSidebarCommands({ items: AdminSidebar({ t, appConfiguration: rootData.appConfiguration }) }).map((i) => {
    return {
      ...i,
      perform(action) {
        navigate(action.id);
      },
    };
  });
  actions.push({
    id: "create account",
    shortcut: [],
    name: t("app.commands.tenants.create"),
    keywords: "",
    perform: () => {
      navigate("/new-account");
    },
  });
  actions.push({
    id: "logout",
    shortcut: [],
    name: t("app.commands.profile.logout"),
    perform: () => {
      navigate("/logout");
    },
  });
  return actions;
}

export default {
  getCommands,
};
