"use client";

import { useEffect } from "react";

export const CREATOR_TRANSITION_STORAGE_KEY = "creator-transition-id";

export function CreatorTransitionSync({ creatorId }: { creatorId: string }) {
  useEffect(() => {
    window.sessionStorage.setItem(CREATOR_TRANSITION_STORAGE_KEY, creatorId);
  }, [creatorId]);

  return null;
}
