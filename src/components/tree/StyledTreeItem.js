import TreeItem, { treeItemClasses } from "@mui/lab/TreeItem";
import { styled } from "@mui/material/styles";


const StyledTreeItem = styled(({ rootNode, ...rest }) => <TreeItem {...rest} />)(
   ({ rootNode }) => ({
      position: "relative",
      "&:before": {
         pointerEvents: "none",
         content: '""',
         position: "absolute",
         width: 32,
         left: -16,
         top: 12,
         borderBottom:
            // only display if the TreeItem is not root node
            !rootNode ? `1px dashed gray` : "none"
      },

      [`& .${treeItemClasses.group}`]: {
         marginLeft: 16,
         paddingLeft: 18,
         borderLeft: `1px dashed gray`
      }
   }),
)

export default StyledTreeItem;