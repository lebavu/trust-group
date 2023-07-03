import { ReactNode } from "react";
import PropTypes, { InferProps } from "prop-types";
import "./GlobalStyles.scss";

interface GlobalStylesProps {
  children: ReactNode;
}

function GlobalStyles({ children }: GlobalStylesProps): JSX.Element {
  return <>{children}</>;
}

GlobalStyles.propTypes = {
  children: PropTypes.node.isRequired,
} as InferProps<GlobalStylesProps>;

export default GlobalStyles;
