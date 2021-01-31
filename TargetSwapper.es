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

1502
%{
#include "StdH.h"
%}

// Target swap type
enum ESwapType {
  0 SWT_RANDOM   "Random",
  1 SWT_SEQUENCE "Sequential",
};

class export CCecilTargetSwapper : CRationalEntity {
name      "CecilTargetSwapper";
thumbnail "Cecil\\TinyEntityPack\\Thumbnails\\TargetSwapper.tbn";
features  "HasName", "IsTargetable", "IsImportant";

properties:
  1 BOOL m_bActive "Active" 'A' = TRUE,
  2 CEntityPointer m_penTarget "Target Entity",
  3 CTString m_strProperty     "Target Property" = "",

 10 CTString m_strName "Name" 'N' = "Target Swapper",
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

 40 enum ESwapType m_eSwapType "Swap Type" = SWT_RANDOM,
 41 INDEX m_iCurrentTarget = 0,
 42 INDEX m_iCallerTarget "Caller Target Slot" = -1,

components:
  1 model   MODEL_ENTITY   "Cecil\\TinyEntityPack\\Models\\Entity.mdl",
  2 texture TEXTURE_ENTITY "Cecil\\TinyEntityPack\\Models\\TargetSwapper.tex",

functions:
  // Entity description
  const CTString &GetDescription(void) const {
    INDEX ctTargets = 0;

    for (INDEX iTarget = 0; iTarget < 20; iTarget++) {
      if (SwapperTarget(iTarget) != NULL) {
        ctTargets++;
      }
    }

    ((CTString&)m_strDescription).PrintF("->%s w/ %d %s", (m_penTarget != NULL ? m_penTarget->GetName() : "<none>"), ctTargets, (ctTargets == 1 ? "target" : "targets"));
    return m_strDescription;
  };

  // Count memory used by this object
  SLONG GetUsedMemory(void) {
    // initial
    SLONG slUsedMemory = sizeof(CCecilTargetSwapper) - sizeof(CRationalEntity) + CRationalEntity::GetUsedMemory();
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
  CEntity *SwapperTarget(INDEX iTarget) {
    return (&m_penTarget1)[iTarget];
  };

  CEntity *SwapperTarget(INDEX iTarget) const {
    return (&m_penTarget1)[iTarget];
  };

  // Swap some target
  void SwapTarget(void) {
    // no target entity
    if (!ASSERT_ENTITY(m_penTarget)) {
      return;
    }

    CDArray<INDEX> aiTargets;
    aiTargets.New(20);
    INDEX ctTargets = 0;

    for (INDEX iTarget = 0; iTarget < 20; iTarget++) {
      CEntity *penTarget = SwapperTarget(iTarget);

      if (!ASSERT_ENTITY(penTarget)) {
        continue;
      }

      aiTargets[ctTargets] = iTarget;
      ctTargets++;
    }

    if (ctTargets > 0) {
      // random target
      if (m_eSwapType == SWT_RANDOM) {
        // add amount of passed ticks
        INDEX iRndFactor = (IRnd() + _pTimer->CurrentTick() / _pTimer->TickQuantum);
        // random target from the array
        m_iCurrentTarget = aiTargets[iRndFactor % ctTargets];
      
      // next target
      } else {
        m_iCurrentTarget = (m_iCurrentTarget+1) % ctTargets;
      }

      // find property by its name
      CEntityProperty *pep = m_penTarget->PropertyForName(m_strProperty);

      // no property
      if (pep == NULL) {
        WarningMessage("Property '%s' does not exist in %s!", m_strProperty, m_penTarget->GetName());
        return;
      }

      // verify pointer properties
      if (pep->ep_eptType != CEntityProperty::EPT_ENTITYPTR) {
        WarningMessage("Property '%s' of %s is not a target property!", m_strProperty, m_penTarget->GetName());
        return;
      }

      SLONG slOffset = pep->ep_slOffset;

      // set new target
      CEntityPointer *penPointer = (CEntityPointer*)(((UBYTE*)&*m_penTarget) + slOffset);
      *penPointer = SwapperTarget(m_iCurrentTarget);
    }
  };

procedures:
  MainLoop() {
    wait () {
      on (EBegin) : { resume; }

      // swap targets
      on (ETrigger eTrigger) : {
        if (m_bActive) {
          // put caller into some slot
          if (m_iCallerTarget > 0 && m_iCallerTarget <= 20) {
            (&m_penTarget1)[m_iCallerTarget-1] = eTrigger.penCaused;
          }

          SwapTarget();
        }
        resume;
      }

      // activate
      on (EActivate) : {
        m_bActive = true;
        resume;
      }

      // deactivate
      on (EDeactivate) : {
        m_bActive = FALSE;
        resume;
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

    jump MainLoop();

    return;
  }
};