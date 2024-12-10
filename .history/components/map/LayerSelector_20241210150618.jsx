import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const LayerSelector = ({ layers, selectedLayer, onSelectLayer }) => {
  return (
    <FormControl
      variant="outlined"
      sx={{
        minWidth: 300,
        marginBottom: "1rem",
        backgroundColor: "var(--color-darkblue1)",
        borderRadius: "4px",
        boxShadow: "0 4px 8px var(--color-black-transparent)",
      }}
    >
      <InputLabel
        sx={{
            color: "var(--color-white2)",
            "&.Mui-focused": {
            color: "white", // Culoarea când are focus
            },
            "&.MuiFormLabel-filled": {
            color: "white", // Culoarea când este completat
            },
        }}
      >
        Layer
      </InputLabel>
      <Select
        value={selectedLayer ? selectedLayer.name : ""}
        onChange={(e) =>
          onSelectLayer(layers.find((layer) => layer.name === e.target.value))
        }
        label="Layer"
        sx={{
            color: "var(--color-white2)",
            backgroundColor: "var(--color-darkblue1)",
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "white", // Schimbă culoarea outline-ului la focus
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "white", // Schimbă culoarea outline-ului la hover
            },
          }}
      >
        {layers.map((layer) => (
          <MenuItem
            key={layer.name}
            value={layer.name}
            sx={{
              backgroundColor: "white",
              color: "black",
              "&:hover": {
                backgroundColor: "var(--color-white2)",
              },
            }}
          >
            {layer.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LayerSelector;
