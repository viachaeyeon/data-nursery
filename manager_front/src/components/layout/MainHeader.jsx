import React,{useState,useEffect} from "react";
import styled from "styled-components";

// const NoSSR = dynamic(() => import('../components/no-ssr'), { ssr: false })
import ProfileIcon from "../../../public/images/common/icon-profile.svg";


const S = {
  Wrap: styled.div`
    display: flex;
    justify-content: space-between;
  `,
  DateWrap: styled.div`
    p {
      color: "#405F8D";
      font-size: 20px;
      font-weight: 700;
      line-height: 24px;
    }
  `,
  profileWrap: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 17.5px;

    p {
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: -0.32px;
      color: #405F8D;
    }
  `,
};
function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

function MainHeader() {
  const userName = "박희진";

  const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime());
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(intervalId);
  }, []);


  return (
    <S.Wrap>
      <S.DateWrap>
      <p>{currentDateTime}</p>
      </S.DateWrap>
      <S.profileWrap>
        <ProfileIcon width={21} height={22} />
        <p>안녕하세요, {userName}님</p>
      </S.profileWrap>
    </S.Wrap>
  );
}

export default MainHeader;
// export default function Page(){
//   return(
//     <div>
//       <NoSSR />
//     </div>
//   )
// };
