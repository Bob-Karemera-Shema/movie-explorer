import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";

// pre-typed redux hooks
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();