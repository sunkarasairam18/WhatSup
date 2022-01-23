import React, { useState } from "react";
import { LinkPreview } from "@dhaiwat10/react-link-preview";

const Test = () => {
  return (
    <div>
      <LinkPreview
        url="https://youtu.be/SkENAjfVoNI"
        width="350px"
        textAlign="left"
        descriptionLength={40}
        imageHeight={200}
        secondaryTextColor="black"
        backgroundColor="lightgray"
      />
    </div>
  );
};

export default Test;
