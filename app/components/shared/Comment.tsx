import { Badge, Box } from "@radix-ui/themes";
import { useSelector } from "react-redux";
import { DeleteIcon, Flex, UserIcon } from "~/components";
import { getState } from "~/store";
import { toUsername, fullDateString, toCss, timeAgo } from "~/utils";

export const Comment = (props) => {
  const { comment, onDeleteClick, ...p } = props;
  const { auth, locale } = useSelector(getState);
  const user = auth?.user;

  return (
    <Flex key={"comment-" + comment.id} justify="between" p="3" {...p}>
      {/* comment */}
      <Box>
        <Badge size="3" mr="3" variant="surface">
          <UserIcon />
          {toUsername(comment.comment_email)}
        </Badge>
        {comment.html}
      </Box>

      <Flex
        gap="1"
        style={{
          cursor: "pointer",
        }}
      >
        {/* date */}
        <div css={toCss({ whiteSpace: "nowrap" })}>
          <Badge title={fullDateString(comment.created_at, locale)}>
            {timeAgo({ date: comment.created_at })}
          </Badge>
        </div>

        {/* delete */}
        {comment.comment_email === user?.email && (
          <DeleteIcon
            onClick={() => {
              onDeleteClick(comment);
            }}
          />
        )}
      </Flex>
    </Flex>
  );
};
