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

1503
%{
#include "StdH.h"

// Compare float values
#define COMP_F(_Class, _Value, _Cond) \
  if (m_bCompareCaller) { \
    fValue = penCaused->_Value; \
  } SendCheck(penCheck->_Value _Cond fValue);

// Compare float values of some class
#define COMP_FC(_Class, _Value, _Cond) \
  if (m_bCompareCaller) { \
    fValue = ((_Class*)penCaused)->_Value; \
  } SendCheck(((_Class*)penCheck)->_Value _Cond fValue);

// Compare string contents
#define COMP_S(_Value, _Cond) \
  if (m_bCompareCaller) { \
    strValue = penCaused->_Value; \
  } SendCheck(penCheck->_Value _Cond strValue);

// Compare string lengths
#define COMP_S_L(_Value, _Cond) \
  if (m_bCompareCaller) { \
    strValue = penCaused->_Value; \
  } SendCheck(strlen(penCheck->_Value) _Cond strlen(strValue));

// General comparison templates
#define COMPARE_FLOAT(_Type, _Class, _Value) \
  switch (m_eCondition) { \
    case CON_EQ:  COMP_##_Type(_Class, _Value, ==); break; \
    case CON_NEQ: COMP_##_Type(_Class, _Value, !=); break; \
    case CON_GT:  COMP_##_Type(_Class, _Value, > ); break; \
    case CON_GTE: COMP_##_Type(_Class, _Value, >=); break; \
    case CON_LT:  COMP_##_Type(_Class, _Value, < ); break; \
    case CON_LTE: COMP_##_Type(_Class, _Value, <=); break; \
  }

#define COMPARE_STRING(_Value) \
  switch (m_eCondition) { \
    case CON_EQ:  COMP_S(_Value, ==); break; \
    case CON_NEQ: COMP_S(_Value, !=); break; \
    case CON_GT:  COMP_S_L(_Value, > ); break; \
    case CON_GTE: COMP_S_L(_Value, >=); break; \
    case CON_LT:  COMP_S_L(_Value, < ); break; \
    case CON_LTE: COMP_S_L(_Value, <=); break; \
  }

%}

// Condition type
enum EConditionType {
  0 CON_EQ  "== (Equal)",
  1 CON_NEQ "!= (Not equal)",
  2 CON_GT  "> (More than)",
  3 CON_GTE ">= (More or equal)",
  4 CON_LT  "< Less than",
  5 CON_LTE "<= Less or equal",
};

// What to check
enum ECheckType {
  0 CHT_NAME   "Name",
  1 CHT_POSX   "Position X",
  2 CHT_POSY   "Position Y",
  3 CHT_POSZ   "Position Z",
  4 CHT_ROTX   "Rotation X",
  5 CHT_ROTY   "Rotation Y",
  6 CHT_ROTZ   "Rotation Z",
  7 CHT_HEALTH "Health",
  8 CHT_SPEED  "Moving speed",
};

class export CCecilEntityChecker : CRationalEntity {
name      "CecilEntityChecker";
thumbnail "Cecil\\TinyEntityPack\\Thumbnails\\EntityChecker.tbn";
features  "HasName", "IsTargetable", "IsImportant";

properties:
  1 BOOL m_bActive "Active" 'A' = TRUE,
  2 CEntityPointer m_penTarget "Target",
  3 enum EEventType m_eTarget  "Target Event" = EET_TRIGGER,
  4 CEntityPointer m_penCaused,

 10 CTString m_strName "Name" 'N' = "Entity Checker",
 11 CTString m_strDescription = "",
 
 20 CEntityPointer m_penCheck        "Check Entity",
 21 enum ECheckType m_eCheck         "Check Type" = CHT_HEALTH,
 22 enum EConditionType m_eCondition "Check Condition" = CON_EQ,
 23 CTString m_strValue   "Check Value" = "",
 24 BOOL m_bCompareCaller "Compare with caller" = FALSE,

components:
  1 model   MODEL_ENTITY   "Cecil\\TinyEntityPack\\Models\\Entity.mdl",
  2 texture TEXTURE_ENTITY "Cecil\\TinyEntityPack\\Models\\EntityChecker.tex",

functions:
  // Entity description
  const CTString &GetDescription(void) const {
    ((CTString&)m_strDescription).PrintF("->%s (%s)", (m_penCheck != NULL ? m_penCheck->GetName() : "<none>"), ECheckType_enum.NameForValue(m_eCheck));
    return m_strDescription;
  };

  // Count memory used by this object
  SLONG GetUsedMemory(void) {
    // initial
    SLONG slUsedMemory = sizeof(CCecilEntityChecker) - sizeof(CRationalEntity) + CRationalEntity::GetUsedMemory();
    // add some more
    slUsedMemory += m_strName.Length();
    slUsedMemory += m_strDescription.Length();
    return slUsedMemory;
  };

  // Get the checking entity
  CEntity *GetTarget(void) const {
    return m_penCheck;
  };

  // Send events if the check has passed
  void SendCheck(BOOL bResult) {
    if (!bResult) {
      return;
    }

    SendToTarget(m_penTarget, m_eTarget, m_penCaused);
  };
  
  // Do the value comparison
  void DoComparison(CEntity *penCaused) {
    // no checking entity
    if (!ASSERT_ENTITY(m_penCheck)) {
      return;
    }

    // make sure there's a caller
    if (m_bCompareCaller) {
      penCaused = FixupCausedToPlayer(this, penCaused);

      if (penCaused == NULL) {
        return;
      }
    }

    // remember the caller
    m_penCaused = penCaused;

    // convert to raw entity pointer
    CEntity *penCheck = m_penCheck;

    // get float value
    FLOAT fValue = 0.0f;
    m_strValue.ScanF("%f", &fValue);
    
    // get string value
    CTString strValue = m_strValue;
    
    switch (m_eCheck) {
      case CHT_NAME: COMPARE_STRING(GetName()); break;
        
      case CHT_POSX: COMPARE_FLOAT(F, CEntity, GetPlacement().pl_PositionVector(1)); break;
      case CHT_POSY: COMPARE_FLOAT(F, CEntity, GetPlacement().pl_PositionVector(2)); break;
      case CHT_POSZ: COMPARE_FLOAT(F, CEntity, GetPlacement().pl_PositionVector(3)); break;

      case CHT_ROTX: COMPARE_FLOAT(F, CEntity, GetPlacement().pl_OrientationAngle(1)); break;
      case CHT_ROTY: COMPARE_FLOAT(F, CEntity, GetPlacement().pl_OrientationAngle(2)); break;
      case CHT_ROTZ: COMPARE_FLOAT(F, CEntity, GetPlacement().pl_OrientationAngle(3)); break;

      case CHT_HEALTH:
        // only live entities
        if (ASSERT_CLiveEntity(penCaused)) {
          COMPARE_FLOAT(FC, CLiveEntity, GetHealth());
        }
        break;
        
      case CHT_SPEED:
        // only movable entities
        if (!(penCaused->GetPhysicsFlags() & EPF_MOVABLE)) {
          COMPARE_FLOAT(FC, CMovableEntity, GetDesiredTranslation().Length());
        }
        break;
    }
  };

procedures:
  MainLoop() {
    wait () {
      on (EBegin) : { resume; }

      // check the entity
      on (ETrigger eTrigger) : {
        if (m_bActive) {
          DoComparison(eTrigger.penCaused);
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