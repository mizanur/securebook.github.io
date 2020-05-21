import { Wrapped } from "@interfaces/Wrapped";

export interface EasingProgress {
    data: Wrapped<{
        time0: number;
        time1: number;
        lastTimestamps: number[];
    }>;
    time: number;
    progress: number;
    updateLastTimestamps(): void;
}