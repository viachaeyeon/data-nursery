import React, { useCallback, useEffect, useState } from "react";

function ContentScrollCheck(layoutRef) {
  const [isScroll, setIsScroll] = useState(false);

  const handleScroll = useCallback((e) => {
    const chatDiv = document.getElementById("content-wrap");
    const nowScrollY = chatDiv.scrollTop;

    if (nowScrollY > 0) {
      setIsScroll(true);
    } else {
      setIsScroll(false);
    }
  }, []);

  useEffect(() => {
    if (!!layoutRef.current) {
      layoutRef.current.addEventListener("scroll", handleScroll);
      return () => layoutRef.current?.removeEventListener("scroll", handleScroll);
    }
  }, [layoutRef]);

  return isScroll;
}

export default ContentScrollCheck;
