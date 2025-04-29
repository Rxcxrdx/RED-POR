import React, { useContext, useState } from "react";
import { UserDetail, UserDetailContainerProps } from "./IUserDetail";
import { UserDetailView } from "./UserDetailView";

export const UserDetailContainer = <
  T extends { userDetail: UserDetail | null }
>({
  ContextProvider,
  reports,
  hiddenFields = [],
}: UserDetailContainerProps<T>) => {
  const { userDetail } = useContext(ContextProvider);
  const [opened, setOpened] = useState(false);
  const toggle = () => setOpened((prev) => !prev);

  return (
    <UserDetailView
      userDetail={userDetail}
      opened={opened}
      onToggle={toggle}
      reports={reports}
      hiddenFields={hiddenFields}
    />
  );
};
