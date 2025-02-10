import { ChangeLevel } from "@/app/ui/icons";
import Radio from "@/app/ui/Radio";
import { O, TE } from "@/app/utils/functions";
import {
  LevelTypesChangeInfo,
  ScopeElement,
} from "@opensystemslab/buildx-core";
import { pipe } from "fp-ts/function";
import { useEffect, useState } from "react";
import ContextMenuNested from "../common/ContextMenuNested";

type Props = {
  scopeElement: ScopeElement;
  close: () => void;
};

const ChangeLevelType = (props: Props) => {
  const { scopeElement, close } = props;

  const houseGroup = scopeElement.elementGroup.houseGroup;

  const [levelTypesChangeInfo, setLevelTypesChangeInfo] =
    useState<LevelTypesChangeInfo | null>(null);

  useEffect(() => {
    const levelTypesManager = houseGroup.managers.levelTypes;
    if (!levelTypesManager) return;

    pipe(
      levelTypesManager.getLevelTypesChangeInfo(scopeElement),
      TE.map((foo) => {
        setLevelTypesChangeInfo(foo);
      })
    )();
  }, [houseGroup, scopeElement]);

  const children =
    levelTypesChangeInfo === null
      ? undefined
      : pipe(
          levelTypesChangeInfo.allOpts.sort((a, b) =>
            a.levelType.code.localeCompare(b.levelType.code)
          ),
          (allAlts) => (
            <Radio
              options={allAlts.map((value) => ({
                label: value.levelType.description,
                value,
              }))}
              onHoverChange={(value) => {
                pipe(
                  value,
                  O.fromNullable,
                  O.match(
                    () => {
                      houseGroup.managers.layouts.previewLayoutGroup = O.none;
                    },
                    (value) => {
                      houseGroup.managers.layouts.previewLayoutGroup = O.some(
                        value.layoutGroup
                      );
                    }
                  )
                );
              }}
              onChange={(value) => {
                houseGroup.managers.layouts.activeLayoutGroup =
                  value.layoutGroup;
                houseGroup.managers.zStretch?.init();
                close();
              }}
              selected={levelTypesChangeInfo.currentOpt}
              compare={(a, b) => a.levelType === b.levelType}
            />
          )
        );

  const levelString = pipe(
    scopeElement.elementGroup.moduleGroup.userData.module.structuredDna
      .levelType,
    (code) => {
      let levelString = "level height";

      if (code[0] === "F") {
        levelString = "foundations";
      }

      if (code[0] === "R") {
        levelString = "roof type";
      }

      return levelString;
    }
  );

  return (
    <ContextMenuNested
      long
      label={`Change ${levelString}`}
      icon={<ChangeLevel />}
      unpaddedSvg
    >
      {children}
    </ContextMenuNested>
  );
};

export default ChangeLevelType;
