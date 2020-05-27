import { EditorMark } from "@editor/interfaces/EditorMark";
import { MarkSpec } from "prosemirror-model";

export class LinkMark implements EditorMark {
    name: string = "link";

    markSpec: MarkSpec = {
        attrs: {
            href: {},
            title: {default: null}
        },
        inclusive: false,
        parseDOM: [{
            tag: "a[href]",
            getAttrs(dom: any) {
                return {
                    href: dom.getAttribute("href"),
                    title: dom.getAttribute("title")
                }
            }
        }],
        toDOM(node) {
            return ["a", node.attrs, 0];
        }
    }
}