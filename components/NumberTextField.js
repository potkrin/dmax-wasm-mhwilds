import React from "react";
import { TextField } from "@mui/material";

// 注意: NumberTextField の呼び出し元で parseInt すること
export function NumberTextField(props) {
  const { min, max, value, matches, decimalPoint, ...rest } = props; // min, max, value を分離

  const handleChange = (event) => {
    let newValue = 0;
    if (decimalPoint) {
      newValue = event.target.value.replace(/[^0-9.]/g, ""); // 数字と小数点以外を削除
    } else {
      newValue = parseInt(event.target.value.replace(/\D/g, "")); // 数字以外を削除
      newValue = isNaN(newValue) ? 0 : newValue; // 数字以外の場合は0にする
      newValue = min > newValue ? min : newValue; // minより小さい場合はminにする
      newValue = max < newValue ? max : newValue; // maxより大きい場合はmaxにする
    }
    // HTML の <input> 要素の value 属性は常に string として保持されるため、number を代入しても string になる
    // NumberTextField の呼び出し元で parseInt すること
    event.target.value = newValue;

    if (props.onChange) {
      props.onChange(event);
    }
  };

  return (
    <TextField
      {...rest}
      value={value}
      onChange={handleChange}
      type={decimalPoint ? "text" : "number"}
      inputProps={{ ...rest.inputProps }}
      InputProps={{
        disableUnderline: matches ? false : true,
      }}
    />
  );
}

export default NumberTextField;
