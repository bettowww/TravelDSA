import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const LayerSelector = ({ layers, selectedLayer, onSelectLayer }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",  // 🔥 Centrează orizontal
        width: "100%",             // Ocupă toată lățimea disponibilă
        marginBottom: "2px",      // Spațiu sub dropdown
      }}
    >
      <FormControl
        variant="outlined"
        sx={{
          minWidth: 250,
          backgroundColor: "var(--color-darkblue1)",
          borderRadius: "4px",
          boxShadow: "0 4px 8px var(--color-black-transparent)",
        }}
      >
        <InputLabel
          sx={{
            color: "var(--color-white2)",
            "&.Mui-focused": {
              color: "white",
            },
            "&.MuiFormLabel-filled": {
              color: "white",
            },
          }}
        >
          Tema
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
              borderColor: "white",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "white",
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
    </div>
  );
};

export default LayerSelector;
