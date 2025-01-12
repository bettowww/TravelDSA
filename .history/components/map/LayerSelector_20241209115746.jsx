import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const LayerSelector = ({ layers, selectedLayer, onSelectLayer }) => {
  return (
    <FormControl
      variant="outlined"
      style={{
        minWidth: 300,
        marginBottom: "1rem",
      }}
    >
      <InputLabel>Layer</InputLabel>
      <Select
        value={selectedLayer ? selectedLayer.name : ""}
        onChange={(e) =>
          onSelectLayer(layers.find((layer) => layer.name === e.target.value))
        }
        label="Layer"
      >
        {layers.map((layer) => (
          <MenuItem key={layer.name} value={layer.name}>
            {layer.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LayerSelector;
