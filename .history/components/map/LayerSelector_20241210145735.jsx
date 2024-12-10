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
        boxShadow: "var(--color-black-transparent)",
      }}
    >
      <InputLabel
        sx={{
          color: "var(--color-white2)",
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
