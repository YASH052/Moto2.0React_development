import { Grid } from "@mui/material";
import { RIAuditUpdate } from "./RIAuditUpdate";
const RIAuditScore = () => {
  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
        }}
      >
        {/* Add this after the NuralAccordion2 component */}
        <Grid sx={12} md={12} lg={12} padding={1}>
          <RIAuditUpdate />
        </Grid>
      </Grid>
    </>
  );
};

export default RIAuditScore;
