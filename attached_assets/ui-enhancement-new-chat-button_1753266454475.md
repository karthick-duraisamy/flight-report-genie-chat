
# ✨ UI Enhancement Requirement: Replace "Recent Actions" with Modern "New Chat" Button

## 🧾 Context
In the current Airline Report Assistant UI, the **"Recent Actions"** section is displayed in the left sidebar. However, since the backend API for recent actions is planned for the next sprint, this section should be **temporarily removed** and replaced with a modern alternative.

---

## 🎯 Objective

Replace the **"Recent Actions"** section in the sidebar with a **clean, modern "New Chat" or "Start New Conversation" button**.

---

## 🧱 Design Requirements

### 🔄 Remove
- The entire section titled `Recent Actions`
- Any hardcoded or static list of recent reports/actions

---

### ➕ Add
#### A modern "New Chat" button:
- Label: `➕  New Chat` or `🗨️ Start New Conversation`
- Position: **Top of sidebar**, center-aligned or left-aligned with padding
- Style:
  - Rounded corners (`border-radius: 8px` or more)
  - Soft shadow (`box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1)`)
  - Subtle background gradient or Ant Design `primary` button style
  - Icon: Plus (`+`) or chat bubble

#### ✅ Example (Ant Design JSX):
```tsx
<Button
  type="primary"
  icon={<PlusOutlined />}
  style={{
    width: '90%',
    margin: '20px auto',
    display: 'block',
    borderRadius: '8px',
    fontWeight: 500,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)'
  }}
>
  New Chat
</Button>
```

---

## 🧑‍💻 Behavior

- Clicking the button should:
  - Clear any current conversation context
  - Reset the main chat window to show the welcome message again
  - Prepare the interface to accept a new message

---

## 📱 Responsiveness

- On smaller screens (mobile/tablet):
  - Button should span full width (`100%`)
  - Use icon-only layout or compact label (e.g., just `+` on small screens)

---

## 🔧 Tech Stack Notes

- Use Ant Design's `Button` component with `icon` prop
- Avoid hardcoded recent action data — rely on backend integration in next sprint

---

## 🖼️ Visual Example (Suggested Layout)

```
+--------------------------------+
|  Airline Assistant             |
|                                |
|  [➕ New Chat]                  |
|                                |
|  (Empty until recent API is up)|
+--------------------------------+
```

---

## ✅ Summary

| Feature           | Status      |
|------------------|-------------|
| Recent Actions    | ❌ Removed   |
| New Chat Button   | ✅ Added     |
| Responsive Design | ✅ Required |
| Backend Dependent | ❌ Not now  |
