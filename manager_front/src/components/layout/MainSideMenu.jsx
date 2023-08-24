import React from "react";
import Image from "next/image";
import { styled } from "styled-components";
import { useRouter } from "next/router";

import ListIcon from "../../../public/images/common/icon-list.svg";
import HouseIcon from "../../../public/images/common/icon-house.svg";
import GraphIcon from "../../../public/images/common/w-icon-graph.svg";
import SettingIcon from "../../../public/images/common/w-icon-setting.svg";

const S = {
  Wrap: styled.aside`
    display: grid;

.sidebar{
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.sidebar-text{
    color: #464F64;
    font-size: 20px;
    font-weight: 700;
    line-height: 24px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  padding: 12px 32px;
  gap:24px;
  width: 198px;
  height: 64px;
}

.menu-item.active {
  background-color: #5899FB;
  color: white;
  width: 198px;
  height: 64px;
  border-radius:8px;

  p{
    color: white;
  }
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}
  `,
  SideMenuInner: styled.div`
    padding: 64px 32px 0px 32px;
    min-height: 100vh !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    .main-logo {
      margin-bottom: 72px;
      width: 198px;
      height: 31.8px;
      position: relative;
      list-style: none;
    }
  `,
  MenuItemWrapper: styled.div`
    display: flex;
    flex-direction: column;
    gap: 27px;
    cursor: pointer;
  `,
};

function ManageSideMenu() {
  const router = useRouter();


  const menuItems = [
    { path: '/dashboard', label: '개요', icon: <ListIcon /> },
    { path: '/farm-management', label: '농가관리', icon: <HouseIcon /> },
    { path: '/statistics', label: '통계현황', icon: <GraphIcon /> },
    { path: '/setting', label: '설정', icon: <SettingIcon /> },
  ];

  return (
    <S.Wrap>
      <S.SideMenuInner>
        <li className="main-logo">
          <Image src={"/images/common/logo-data-nursery.svg"} layout="fill" />
        </li>

<div className="sidebar">
      {menuItems.map((item) => (
        <div
          key={item.path}
          className={`menu-item ${
            router.pathname === item.path ? 'active' : ''
          }`}
          onClick={() => router.push(item.path)}
        >
          <img src={`${item.icon}`} alt={item.label} className="icon" width={40} height={40} />
          <p className="sidebar-text">{item.label}</p>
        </div>
      ))}
    </div>
      </S.SideMenuInner>
    </S.Wrap>
  );
}

export default ManageSideMenu;