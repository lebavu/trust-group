import { memo } from "react";
import { Outlet } from "react-router-dom";
import LoginHeader from "@/components/LoginHeader";

interface Props {
  children?: React.ReactNode
}
function NoneLayoutInner({ children }: Props) {
  return (
    <div>
      <LoginHeader />
      {children}
      <Outlet />
    </div>
  );
}

const NoneLayout = memo(NoneLayoutInner);

export default NoneLayout;
