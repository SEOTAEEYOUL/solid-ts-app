import { createSignal, JSX, Show } from 'solid-js';
// import styles from './MenuBtn.module.css'; // CSS 모듈 사용 시
import { useMenuStore } from '@/stores/store'; // SolidJS용 zustand 대체(예시)
// import { useMenuStore } from "@/stores/store.ts";

interface MenuBtnProps {
  menuName: string;
  imgURL: string;
  selectimgURL: string;
  isActive?: boolean;
  onClick?: () => void;
  children?: JSX.Element;
}

const MenuBtn = (props: MenuBtnProps) => {
  const [isHover, setIsHover] = createSignal(false);
  const setCurrentMenu = useMenuStore((state) => state.setCurrentMenu);
  // const { setCurrentMenu } = useMenuStore();

  const handleMouseOver = () => setIsHover(true);
  const handleMouseOut = () => setIsHover(false);

  const handleClick = () => {
    setCurrentMenu(props.menuName);
    props.onClick && props.onClick();
  };

  return (
    <>
      <button
        type="button"
        // class={styles.menuBtn} // CSS 모듈 사용 시
        style={{
          display: 'flex',
          'flex-direction': 'column',
          'align-items': 'center',
          border: 'none',
          background: 'none',
          cursor: 'pointer'
        }}
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        aria-pressed={props.isActive}
      >
        <div>
          <img
            src={isHover() || props.isActive ? props.selectimgURL : props.imgURL}
            alt="menu_image"
            style={{
              width: '50px',
              height: '50px',
              transition: 'transform 0.2s ease-in-out'
            }}
          />
        </div>
        <p
          // class={styles.menu_name}
          style={{
            'margin-top': '8px',
            'font-size': '14px',
            color: '#333'
          }}
        >
          {props.menuName}
        </p>
      </button>
      <Show when={props.isActive}>
        {props.children}
      </Show>
    </>
  );
};

export default MenuBtn;
