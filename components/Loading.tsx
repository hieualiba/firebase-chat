import { LinearProgress, Stack } from "@mui/material";

export interface ILoadingProps {
}

export default function Loading (props: ILoadingProps) {
  return (
    <div className="h-screen flex justify-center items-center p-20">
      <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
        <LinearProgress color="secondary" />
        <LinearProgress color="success" />
        <LinearProgress color="inherit" />
      </Stack>
    </div>
  );
}
