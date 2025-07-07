import { Badge, Box } from "@radix-ui/themes";
import { useState } from "react";
import { useSelector } from "react-redux";
import { DeleteIcon, Flex, UserIcon } from "~/components";
import { getState } from "~/store";
import {
  toUsername,
  fullDateString,
  toCss,
  timeAgo,
  localize,
  user_badge_click,
} from "~/utils";

export const Comment = (props) => {
  const { comment, onDeleteClick, ...p } = props;
  const { auth, locale } = useSelector(getState);
  const user = auth?.user;
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Flex key={"comment-" + comment.id} justify="between" p="3" {...p}>
      {/* comment */}
      <Box>
        <Badge
          size="3"
          mr="3"
          variant="surface"
          onClick={() => alert(user_badge_click)}
        >
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
        {(process.env.NODE_ENV === "development" ||
          comment.comment_email === user?.email) && (
          <DeleteIcon
            onClick={async () => {
              const ok = confirm(
                localize(
                  "Êtes-vous sûr de vouloir supprimer ce commentaire ?",
                  "Do you really want to delete this comment?",
                ),
              );
              if (!ok) return;
              setIsLoading(true);
              await onDeleteClick(comment);
              setIsLoading(false);
            }}
          />
        )}
      </Flex>
    </Flex>
  );
};
