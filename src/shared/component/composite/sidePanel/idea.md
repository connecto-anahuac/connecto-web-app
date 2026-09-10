以下のイメージ
Mainは任意のUI
typeを指定して開くパネルを変更
option：
- Mainの上に描画or Panel横幅分のMainを縮ませ同階層表示
- sidepanel.viewportを親に対してoffset 上下左右のpaddingなど
- panel出現を上下左右指定
```tsx
<SidePanel.Root>
  <Main/>
  <SidePanel.Viewport>
    <SidePanel.Content type="student">
      {(panel) => <StudentDetail id={panel.id} />}
    </SidePanel.Content>

    <SidePanel.Content type="course">
      {(panel) => <CourseDetail id={panel.id} />}
    </SidePanel.Content>
  </SidePanel.Viewport>
</SidePanel.Root>
```