import { RouterLink } from "../routes/router";

type BottomNavItem = {
  to: string;
  label: string;
  icon: string;
  reloadDocument?: boolean;
};

type BottomNavProps = {
  items: BottomNavItem[];
  currentPath: string;
};

const BottomNav = ({ items, currentPath }: BottomNavProps) => {
  return (
    <nav className="ws-bottom-nav" aria-label="Primary">
      <ul>
        {items.map((item) => {
          const isActive = currentPath === item.to;
          return (
            <li key={item.to}>
              <RouterLink
                className={`ws-bottom-nav__link${isActive ? " is-active" : ""}`}
                to={item.to}
                reloadDocument={item.reloadDocument}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </RouterLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
