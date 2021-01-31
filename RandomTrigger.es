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

1501
%{
#include "StdH.h"
%}

class export CCecilRandomTrigger : CRationalEntity {
name      "CecilRandomTrigger";
thumbnail "Cecil\\TinyEntityPack\\Thumbnails\\RandomTrigger.tbn";
features  "HasName", "IsTargetable", "IsImportant";

properties:
  1 BOOL m_bActive "Active" 'A' = TRUE,
  2 CEntityPointer m_penCaused,

 10 CTString m_strName "Name" 'N' = "Random Trigger",
 11 CTString m_strDescription = "",

 20 CEntityPointer m_penTarget1  "Target 01" 'T' COLOR(0xFF0000FF),
 21 CEntityPointer m_penTarget2  "Target 02" 'Y' COLOR(0xFF0000FF),
 22 CEntityPointer m_penTarget3  "Target 03" 'U' COLOR(0xFF0000FF),
 23 CEntityPointer m_penTarget4  "Target 04" 'I' COLOR(0xFF0000FF),
 24 CEntityPointer m_penTarget5  "Target 05" 'O' COLOR(0xFF0000FF),
 25 CEntityPointer m_penTarget6  "Target 06"     COLOR(0xFF0000FF),
 26 CEntityPointer m_penTarget7  "Target 07"     COLOR(0xFF0000FF),
 27 CEntityPointer m_penTarget8  "Target 08"     COLOR(0xFF0000FF),
 28 CEntityPointer m_penTarget9  "Target 09"     COLOR(0xFF0000FF),
 29 CEntityPointer m_penTarget10 "Target 10"     COLOR(0xFF0000FF),
 30 CEntityPointer m_penTarget11 "Target 11"     COLOR(0xFF0000FF),
 31 CEntityPointer m_penTarget12 "Target 12"     COLOR(0xFF0000FF),
 32 CEntityPointer m_penTarget13 "Target 13"     COLOR(0xFF0000FF),
 33 CEntityPointer m_penTarget14 "Target 14"     COLOR(0xFF0000FF),
 34 CEntityPointer m_penTarget15 "Target 15"     COLOR(0xFF0000FF),
 35 CEntityPointer m_penTarget16 "Target 16"     COLOR(0xFF0000FF),
 36 CEntityPointer m_penTarget17 "Target 17"     COLOR(0xFF0000FF),
 37 CEntityPointer m_penTarget18 "Target 18"     COLOR(0xFF0000FF),
 38 CEntityPointer m_penTarget19 "Target 19"     COLOR(0xFF0000FF),
 39 CEntityPointer m_penTarget20 "Target 20"     COLOR(0xFF0000FF),

 40 enum EEventType m_eEvent1  "Event Type 01" = EET_TRIGGER,
 41 enum EEventType m_eEvent2  "Event Type 02" = EET_TRIGGER,
 42 enum EEventType m_eEvent3  "Event Type 03" = EET_TRIGGER,
 43 enum EEventType m_eEvent4  "Event Type 04" = EET_TRIGGER,
 44 enum EEventType m_eEvent5  "Event Type 05" = EET_TRIGGER,
 45 enum EEventType m_eEvent6  "Event Type 06" = EET_TRIGGER,
 46 enum EEventType m_eEvent7  "Event Type 07" = EET_TRIGGER,
 47 enum EEventType m_eEvent8  "Event Type 08" = EET_TRIGGER,
 48 enum EEventType m_eEvent9  "Event Type 09" = EET_TRIGGER,
 49 enum EEventType m_eEvent10 "Event Type 10" = EET_TRIGGER,
 50 enum EEventType m_eEvent11 "Event Type 11" = EET_TRIGGER,
 51 enum EEventType m_eEvent12 "Event Type 12" = EET_TRIGGER,
 52 enum EEventType m_eEvent13 "Event Type 13" = EET_TRIGGER,
 53 enum EEventType m_eEvent14 "Event Type 14" = EET_TRIGGER,
 54 enum EEventType m_eEvent15 "Event Type 15" = EET_TRIGGER,
 55 enum EEventType m_eEvent16 "Event Type 16" = EET_TRIGGER,
 56 enum EEventType m_eEvent17 "Event Type 17" = EET_TRIGGER,
 57 enum EEventType m_eEvent18 "Event Type 18" = EET_TRIGGER,
 58 enum EEventType m_eEvent19 "Event Type 19" = EET_TRIGGER,
 59 enum EEventType m_eEvent20 "Event Type 20" = EET_TRIGGER,

 70 BOOL m_bAutoStart "Auto Start" = FALSE,
 71 FLOAT m_fWaitTime "Wait Time" = 0.0f,
 72 INDEX m_iMaxTrigs "Max Trigs" = 0,
 80 enum EEventType m_eEventAll "Global Event Type" = EET_IGNORE,

components:
  1 model   MODEL_ENTITY   "Cecil\\TinyEntityPack\\Models\\Entity.mdl",
  2 texture TEXTURE_ENTITY "Cecil\\TinyEntityPack\\Models\\RandomTrigger.tex",

functions:
  // Entity description
  const CTString &GetDescription(void) const {
    INDEX ctTargets = 0;

    for (INDEX iTarget = 0; iTarget < 20; iTarget++) {
      if (TriggerTarget(iTarget) != NULL) {
        ctTargets++;
      }
    }

    ((CTString&)m_strDescription).PrintF("%d %s", ctTargets, (ctTargets == 1 ? "target" : "targets"));
    return m_strDescription;
  };

  // Count memory used by this object
  SLONG GetUsedMemory(void) {
    // initial
    SLONG slUsedMemory = sizeof(CCecilRandomTrigger) - sizeof(CRationalEntity) + CRationalEntity::GetUsedMemory();
    // add some more
    slUsedMemory += m_strName.Length();
    slUsedMemory += m_strDescription.Length();
    return slUsedMemory;
  };

  // Get first target
  CEntity *GetTarget(void) const {
    return m_penTarget1;
  };

  // Get target under an index
  CEntity *TriggerTarget(INDEX iTarget) {
    return (&m_penTarget1)[iTarget];
  };

  CEntity *TriggerTarget(INDEX iTarget) const {
    return (&m_penTarget1)[iTarget];
  };

  // Send event to a random target
  void SendTriggerEvents(CEntity *penCaused) {
    CDArray<INDEX> aiTargets;
    aiTargets.New(20);
    INDEX ctTargets = 0;

    for (INDEX iTarget = 0; iTarget < 20; iTarget++) {
      CEntity *penTarget = TriggerTarget(iTarget);

      if (!ASSERT_ENTITY(penTarget)) {
        continue;
      }

      aiTargets[ctTargets] = iTarget;
      ctTargets++;
    }

    if (ctTargets > 0) {
      // add amount of passed ticks
      INDEX iRndFactor = (IRnd() + _pTimer->CurrentTick() / _pTimer->TickQuantum);
      // random target number
      INDEX iRndTarget = aiTargets[iRndFactor % ctTargets];

      CEntity *penTarget = TriggerTarget(iRndTarget);
      EEventType eEvent = (&m_eEvent1)[iRndTarget];

      // send the same event
      if (m_eEventAll != EET_IGNORE) {
        eEvent = m_eEventAll;
      }

      SendToTarget(penTarget, eEvent, penCaused);
    }
  };

procedures:
  EventSender() {
    // wait before sending
    if (m_fWaitTime > 0.0f) {
      wait (m_fWaitTime) {
        on (EBegin) : { resume; }
        on (ETimer) : { stop; }
        on (EDeactivate) : { pass; }
        otherwise(): { resume; }
      }
    }

    SendTriggerEvents(m_penCaused);

    // max trigs is used
    if (m_iMaxTrigs > 0) {
      m_iMaxTrigs--;

      // triggered max amount of times
      if (m_iMaxTrigs <= 0) {
        Destroy();
      }
    }

    return;
  };

  Active() {
    wait () {
      // autostart
      on (EBegin) : {
        if (m_bAutoStart) {
          call EventSender();
        }
        resume;
      }

      // forward it as a trigger event
      on (EStart eStart) : {
        SendToTarget(this, EET_TRIGGER, eStart.penCaused);
        resume;
      }

      // send events
      on (ETrigger eTrigger) : {
        m_penCaused = eTrigger.penCaused;

        call EventSender();
        resume;
      }

      // deactivate
      on (EDeactivate) : {
        m_bActive = FALSE;
        jump Inactive();
      }

      otherwise() : { resume; }
    }

    return;
  };

  Inactive() {
    wait () {
      on (EBegin) : { resume; }

      // activate
      on (EActivate) : {
        m_bActive = TRUE;
        jump Active();
      }

      otherwise() : { resume; }
    }

    return;
  };

  Main() {
    InitAsEditorModel();
    SetPhysicsFlags(EPF_MODEL_IMMATERIAL);
    SetCollisionFlags(ECF_IMMATERIAL);

    SetModel(MODEL_ENTITY);
    SetModelMainTexture(TEXTURE_ENTITY);

    autowait(0.1f);

    if (m_bActive) {
      jump Active();
    } else {
      jump Inactive();
    }

    return;
  }
};