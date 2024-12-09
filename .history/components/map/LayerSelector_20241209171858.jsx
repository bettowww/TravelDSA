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
          "&.Mui-focused": { color: "var(--color-lightblue2)" },
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
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--color-white2)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--color-lightblue2)",
          },
         
          backgroundColor: "var(--color-darkblue1)",
        }}
      >
        {layers.map((layer) => (
          <MenuItem
            key={layer.name}
            value={layer.name}
            sx={{
              backgroundColor: "var(--color-white2)",
              color: "black",
              "&:hover": {
                backgroundColor: "white",
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
