import React, { useState, useEffect } from "react";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

import { staticSkillData } from "../data/StaticData";
import { armors, decoArmorList, decoWeaponList, weaponList } from "../data/EquipData";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function validateSkillAndEquipment() {
  // ここに検証のロジックを記述
  let skillNameSet = new Set();

  for (let armor of armors) {
    for (let skill in armor.skills) {
      skillNameSet.add(skill);
    }
  }

  for (let armor of decoArmorList) {
    for (let skill in armor.skills) {
      skillNameSet.add(skill);
    }
  }

  for (let armor of decoWeaponList) {
    for (let skill in armor.skills) {
      skillNameSet.add(skill);
    }
  }

  for (let weapon of weaponList) {
    for (let skill in weapon.skills) {
      skillNameSet.add(skill);
    }
  }

  for (let skill of skillNameSet) {
    if (!(skill in staticSkillData)) {
      throw new Error("スキル 「" + skill + "」 が見つかりません。");
    }
  }
}

export const ValidateData = () => {
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      validateSkillAndEquipment();
    } catch (err) {
      setError(err.message);
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={error}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
        {error}
      </Alert>
    </Snackbar>
  );
};
