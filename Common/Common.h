/* Copyright (c) 2021 Dreamy Cecil
This program is free software; you can redistribute it and/or modify
it under the terms of version 2 of the GNU General Public License as published by
the Free Software Foundation


This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA. */

// Replace all occurrences of a substring
DECL_DLL CTString ReplaceSubstr(CTString str, const CTString &strSub, const CTString &strReplace);

// Send event to target
DECL_DLL void SendToTarget(CEntity *penSendEvent, EEventType eEventType, CEntity *penCaused = NULL);
// Send event in range
DECL_DLL void SendInRange(CEntity *penSource, EEventType eEventType, const FLOATaabbox3D &boxRange);

DECL_DLL CEntity *FixupCausedToPlayer(CEntity *penThis, CEntity *penCaused, BOOL bWarning = TRUE);

// Compatible session properties (shouldn't be rearranged normally)
class DECL_DLL CImportedSP {
  public:
    enum EGameMode {
      EGM_FLYOVER = -1,
      EGM_COOPERATIVE = 0,
      EGM_SCOREMATCH,
      EGM_FRAGMATCH,
    };

    enum EGameDifficulty {
      EGD_TOURIST = -1,
      EGD_EASY = 0,
      EGD_NORMAL,
      EGD_HARD,
      EGD_EXTREME,
    };

    INDEX sp_ctMaxPlayers;
    BOOL sp_bWaitAllPlayers;
    BOOL sp_bQuickTest;
    BOOL sp_bCooperative;
    BOOL sp_bSinglePlayer;
    BOOL sp_bUseFrags;

    enum GameMode sp_gmGameMode;
    enum GameDifficulty sp_gdGameDifficulty;

    ULONG sp_ulSpawnFlags;
    BOOL sp_bMental;
};

// Get compatible session properties
DECL_DLL inline const CImportedSP *GetSP(void) {
  return (const CImportedSP*)_pNetwork->GetSessionProperties();
};
