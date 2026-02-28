import { httpsCallable } from "firebase/functions";
import type { PlayRequest, PlayResponse } from "../../../shared/types";
import { functions } from "./firebase";

export const play = httpsCallable<PlayRequest, PlayResponse>(functions, "play");
