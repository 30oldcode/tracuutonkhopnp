/* =========================================================================
   PANEL PLUS Việt Nam — shared i18n engine (Tiếng Việt / English / ภาษาไทย)
   Dùng chung cho index.html (tra cứu tồn kho) và lap-don-hang.html (lập đơn).
   - Text tĩnh trong HTML: đánh dấu bằng data-i18n="key" (textContent),
     data-i18n-html="key" (innerHTML, cho phần có thẻ <b>/<code>...),
     data-i18n-placeholder="key" (placeholder input), data-i18n-title="key" (title).
   - Text sinh động trong JS: gọi t('key', {vars}) hoặc t('key.sub', {vars}).
   - Đổi ngôn ngữ: gọi setLang('vi'|'en'|'th'); trang lắng nghe sự kiện
     'i18n:change' trên window để tự vẽ lại phần nội dung động (bảng, đếm...).
   ========================================================================= */
(function(global){
  "use strict";

  const LANGS = ['vi','en','th'];
  const LANG_NAMES = { vi:'Tiếng Việt', en:'English', th:'ภาษาไทย' };
  const LANG_FLAGS = { vi:'🇻🇳', en:'🇬🇧', th:'🇹🇭' };

  const DICT = {
    // ---------- Brand / header (dùng chung) ----------
    brandSubIndex:      { vi:'Việt Nam · Bộ sưu tập Melamine 2025–2026', en:'Vietnam · Melamine Collection 2025–2026', th:'เวียดนาม · คอลเลกชันเมลามีน 2025–2026' },
    brandSubOrder:       { vi:'Việt Nam · Lập đơn hàng nhanh', en:'Vietnam · Quick Order Builder', th:'เวียดนาม · สร้างใบสั่งซื้ออย่างรวดเร็ว' },
    navToOrder:          { vi:'Lập đơn hàng →', en:'Create order →', th:'สร้างใบสั่งซื้อ →' },
    navToLookup:         { vi:'← Tra cứu tồn kho', en:'← Inventory lookup', th:'← ตรวจสอบสต๊อก' },

    // ---------- index.html (tra cứu tồn kho) ----------
    pageTitleIndex:      { vi:'PANEL PLUS Việt Nam · Tra cứu tồn kho theo màu', en:'PANEL PLUS Vietnam · Inventory Lookup by Color', th:'PANEL PLUS เวียดนาม · ตรวจสอบสต๊อกตามสี' },
    h1Index:             { vi:'Tra cứu tồn kho theo màu', en:'Inventory Lookup by Color', th:'ตรวจสอบสต๊อกตามสี' },
    ledeIndex:           { vi:'Gõ tên màu hoặc mã (ví dụ <em>brown nordic elm</em>, <em>bt1</em>, hoặc <em>brown nordic elm bt1</em>) để xem ngay tồn kho — kể cả khi gõ thiếu chữ.',
                            en:'Type a color name or code (e.g. <em>brown nordic elm</em>, <em>bt1</em>, or <em>brown nordic elm bt1</em>) to see stock instantly — even with partial spelling.',
                            th:'พิมพ์ชื่อสีหรือรหัสสี (เช่น <em>brown nordic elm</em>, <em>bt1</em> หรือ <em>brown nordic elm bt1</em>) เพื่อดูสต๊อกได้ทันที แม้พิมพ์ไม่ครบก็ตาม' },

    sourceCardTitleIndex:{ vi:'Nguồn dữ liệu tồn kho', en:'Inventory data source', th:'แหล่งข้อมูลสต๊อก' },
    statusNoData:        { vi:'Chưa có dữ liệu', en:'No data yet', th:'ยังไม่มีข้อมูล' },
    tabSheet:            { vi:'Liên kết Google Sheet', en:'Google Sheet link', th:'ลิงก์ Google Sheet' },
    tabFileIndex:        { vi:'Tải file lên (Excel/CSV)', en:'Upload file (Excel/CSV)', th:'อัปโหลดไฟล์ (Excel/CSV)' },
    tabFileOrder:        { vi:'Tải file Excel lên', en:'Upload Excel file', th:'อัปโหลดไฟล์ Excel' },

    sheetUrlLabel:       { vi:'Link Google Sheet (chia sẻ ở chế độ "Bất kỳ ai có link – Người xem")', en:'Google Sheet link (shared as "Anyone with the link – Viewer")', th:'ลิงก์ Google Sheet (แชร์แบบ "ทุกคนที่มีลิงก์ – ผู้ดู")' },
    sheetTabNameLabel:   { vi:'Tên tab', en:'Tab name', th:'ชื่อแท็บ' },
    loadDataBtn:         { vi:'Tải dữ liệu', en:'Load data', th:'โหลดข้อมูล' },
    sheetHintIndex:      { vi:'Copy nguyên bảng tồn kho (giữ đúng cấu trúc file gốc) vào Google Sheet, đặt tên tab là <code>Main</code> (hoặc điền đúng tên tab bạn dùng). Công cụ tự tìm dòng tiêu đề chứa "Mã vật tư" nên không cần chỉnh sửa gì thêm. Link sẽ được ghi nhớ cho lần sau.',
                            en:'Copy the whole inventory table (keep the original structure) into a Google Sheet, name the tab <code>Main</code> (or enter the tab name you use). The tool auto-detects the header row containing "Mã vật tư" so no further editing is needed. The link is remembered for next time.',
                            th:'คัดลอกตารางสต๊อกทั้งหมด (คงโครงสร้างไฟล์ต้นฉบับ) ไปยัง Google Sheet ตั้งชื่อแท็บว่า <code>Main</code> (หรือใส่ชื่อแท็บที่คุณใช้จริง) เครื่องมือจะค้นหาแถวหัวตารางที่มี "Mã vật tư" เองโดยอัตโนมัติ จึงไม่ต้องแก้ไขเพิ่มเติม ลิงก์จะถูกจดจำไว้สำหรับครั้งถัดไป' },

    dropTextIndex:       { vi:'Kéo thả file <b>.xlsx</b> hoặc <b>.csv</b> vào đây, hoặc bấm để chọn file', en:'Drag and drop an <b>.xlsx</b> or <b>.csv</b> file here, or click to choose a file', th:'ลากไฟล์ <b>.xlsx</b> หรือ <b>.csv</b> มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์' },
    dropTextOrder:       { vi:'Kéo thả file <b>.xlsx</b> vào đây, hoặc bấm để chọn file', en:'Drag and drop an <b>.xlsx</b> file here, or click to choose a file', th:'ลากไฟล์ <b>.xlsx</b> มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์' },
    fileFallbackBtn:     { vi:'Không mở được hộp thoại chọn file? Bấm vào đây', en:"Can't open the file picker? Click here", th:'เปิดหน้าต่างเลือกไฟล์ไม่ได้ใช่ไหม? คลิกที่นี่' },
    fileHintIndex:       { vi:'Dùng đúng file "Báo cáo tồn kho" xuất từ hệ thống — không cần chỉnh sửa gì trước khi tải lên.', en:'Use the "Inventory Report" file exported from the system as-is — no editing needed before upload.', th:'ใช้ไฟล์ "รายงานสต๊อก" ที่ส่งออกจากระบบตามเดิม — ไม่ต้องแก้ไขก่อนอัปโหลด' },

    ipadWarnTitle:       { vi:'⚠️ Dùng iPad (Chrome/Safari) mà nút chọn file không mở hộp thoại?', en:'⚠️ Using iPad (Chrome/Safari) and the file picker button doesn\'t open?', th:'⚠️ ใช้ iPad (Chrome/Safari) แล้วปุ่มเลือกไฟล์ไม่เปิดหน้าต่างใช่ไหม?' },
    ipadWarnBodyIndex:   { vi:'Đây là lỗi thường gặp của Chrome trên iPadOS khi mở hộp thoại chọn file trong 1 số trường hợp (site được thêm vào màn hình chính, hoặc chế độ duyệt riêng tư). Cách ổn định nhất trên iPad là <b>dùng Google Sheet</b> thay vì tải file trực tiếp:',
                            en:'This is a common Chrome-on-iPadOS issue when opening the file picker in certain cases (site added to Home Screen, or private browsing mode). The most reliable option on iPad is to <b>use Google Sheet</b> instead of uploading a file directly:',
                            th:'นี่เป็นปัญหาที่พบบ่อยของ Chrome บน iPadOS เมื่อเปิดหน้าต่างเลือกไฟล์ในบางกรณี (เว็บถูกเพิ่มไว้ที่หน้าจอหลัก หรืออยู่ในโหมดท่องเว็บส่วนตัว) วิธีที่เสถียรที่สุดบน iPad คือ<b>ใช้ Google Sheet</b> แทนการอัปโหลดไฟล์โดยตรง:' },
    ipadStep1:           { vi:'Mở file "Báo cáo tồn kho" (Excel) → tải lên Google Drive.', en:'Open the "Inventory Report" file (Excel) → upload it to Google Drive.', th:'เปิดไฟล์ "รายงานสต๊อก" (Excel) → อัปโหลดขึ้น Google Drive' },
    ipadStep2:           { vi:'Mở file đó bằng <b>Google Sheets</b> (chạm giữ → Mở bằng → Google Trang tính).', en:'Open the file with <b>Google Sheets</b> (long-press → Open with → Google Sheets).', th:'เปิดไฟล์นั้นด้วย <b>Google ชีต</b> (แตะค้าง → เปิดด้วย → Google ชีต)' },
    ipadStep3:           { vi:'Trong Google Sheets: <b>Chia sẻ</b> → chọn "Bất kỳ ai có link" → quyền <b>Người xem</b> → Sao chép link.', en:'In Google Sheets: <b>Share</b> → choose "Anyone with the link" → set to <b>Viewer</b> → Copy link.', th:'ใน Google ชีต: <b>แชร์</b> → เลือก "ทุกคนที่มีลิงก์" → สิทธิ์ <b>ผู้ดู</b> → คัดลอกลิงก์' },
    ipadStep4:           { vi:'Quay lại tab <b>"Liên kết Google Sheet"</b> ở trên, dán link vào, kiểm tra đúng tên tab, rồi bấm <b>Tải dữ liệu</b>.', en:'Go back to the <b>"Google Sheet link"</b> tab above, paste the link, check the tab name, then click <b>Load data</b>.', th:'กลับไปที่แท็บ <b>"ลิงก์ Google Sheet"</b> ด้านบน วางลิงก์ ตรวจสอบชื่อแท็บให้ถูกต้อง แล้วกด <b>โหลดข้อมูล</b>' },
    gotoSheetTabBtn:     { vi:'Chuyển sang tab Liên kết Google Sheet', en:'Switch to Google Sheet link tab', th:'สลับไปแท็บลิงก์ Google Sheet' },
    ipadWarnTitleOrder:  { vi:'⚠️ Trên iPad (Chrome/Safari) mà nút chọn file không mở hộp thoại, hoặc bấm "Tải dữ liệu" ở tab Google Sheet báo lỗi "Failed to fetch"?',
                            en:'⚠️ On iPad (Chrome/Safari), the file picker won\'t open, or clicking "Load data" on the Google Sheet tab shows "Failed to fetch"?',
                            th:'⚠️ บน iPad (Chrome/Safari) ปุ่มเลือกไฟล์ไม่เปิด หรือกด "โหลดข้อมูล" ในแท็บ Google Sheet แล้วขึ้น "Failed to fetch"?' },
    ipadWarnBodyOrder:   { vi:'Đây là do trang đang được mở trực tiếp từ file tải về (<code>file://</code>) thay vì từ một địa chỉ web — trình duyệt trên iPad chặn cả việc mở hộp thoại chọn file lẫn việc tải dữ liệu từ Google Sheet trong trường hợp này. Cách sửa: đưa file HTML này lên một địa chỉ web thật (ví dụ GitHub Pages, giống như trang tra cứu tồn kho), rồi mở qua link <code>https://...</code> đó thay vì mở file trực tiếp.',
                            en:'This happens because the page is opened directly from a downloaded file (<code>file://</code>) instead of a real web address — the iPad browser blocks both the file picker and Google Sheet data loading in this case. Fix: publish this HTML file to a real web address (e.g. GitHub Pages, like the inventory lookup page), then open it via that <code>https://...</code> link instead of opening the file directly.',
                            th:'สาเหตุคือหน้านี้ถูกเปิดโดยตรงจากไฟล์ที่ดาวน์โหลดมา (<code>file://</code>) แทนที่จะเป็นที่อยู่เว็บจริง — เบราว์เซอร์บน iPad จะบล็อกทั้งการเปิดหน้าต่างเลือกไฟล์และการโหลดข้อมูลจาก Google Sheet ในกรณีนี้ วิธีแก้: นำไฟล์ HTML นี้ขึ้นที่อยู่เว็บจริง (เช่น GitHub Pages เหมือนหน้าตรวจสอบสต๊อก) แล้วเปิดผ่านลิงก์ <code>https://...</code> แทนการเปิดไฟล์โดยตรง' },

    searchPlaceholder:   { vi:'Nhập tên màu hoặc mã… ví dụ: brown nordic elm bt1', en:'Enter a color name or code… e.g. brown nordic elm bt1', th:'ป้อนชื่อสีหรือรหัสสี… เช่น brown nordic elm bt1' },
    resultsColorsTitle:  { vi:'Màu khớp trong catalogue', en:'Matching colors in catalogue', th:'สีที่ตรงกันในแคตตาล็อก' },
    resultsRowsTitle:    { vi:'Dòng tồn kho khớp', en:'Matching inventory rows', th:'รายการสต๊อกที่ตรงกัน' },
    thSku:               { vi:'Mã vật tư', en:'Item code', th:'รหัสสินค้า' },
    thName:              { vi:'Tên vật tư', en:'Item name', th:'ชื่อสินค้า' },
    thUnit:              { vi:'ĐVT', en:'Unit', th:'หน่วย' },
    thStock:             { vi:'Tồn kho', en:'Stock', th:'สต๊อก' },
    thStockShort:        { vi:'Tồn', en:'Stock', th:'สต๊อก' },
    emptyStateInitial:   { vi:'Chưa tìm gì cả — gõ tên màu ở ô tìm kiếm phía trên để bắt đầu.', en:"Nothing searched yet — type a color name in the search box above to begin.", th:'ยังไม่ได้ค้นหา — พิมพ์ชื่อสีในช่องค้นหาด้านบนเพื่อเริ่มต้น' },

    overviewTitle:       { vi:'Tổng quan tồn kho — toàn bộ màu catalogue', en:'Inventory overview — all catalogue colors', th:'ภาพรวมสต๊อก — สีทั้งหมดในแคตตาล็อก' },
    allStatus:           { vi:'Tất cả trạng thái', en:'All statuses', th:'ทุกสถานะ' },
    allFinish:           { vi:'Tất cả mã khuôn/mặt', en:'All finishes', th:'ผิวเคลือบทั้งหมด' },
    allThickness:        { vi:'Tất cả độ dày ván', en:'All thicknesses', th:'ความหนาทั้งหมด' },
    allType:             { vi:'Tất cả loại ván', en:'All board types', th:'ประเภทแผ่นทั้งหมด' },
    allMoisture:         { vi:'Tất cả cấp chống ẩm', en:'All moisture grades', th:'ระดับกันชื้นทั้งหมด' },
    allSize:             { vi:'Tất cả khổ ván', en:'All sheet sizes', th:'ขนาดแผ่นทั้งหมด' },
    allGlue:             { vi:'Tất cả loại keo', en:'All glue grades', th:'ชนิดกาวทั้งหมด' },
    allQuality:          { vi:'Tất cả cấp chất lượng', en:'All quality grades', th:'เกรดคุณภาพทั้งหมด' },
    shortStatus:         { vi:'Trạng thái', en:'Status', th:'สถานะ' },
    shortFinish:         { vi:'Mã khuôn/mặt', en:'Finish', th:'ผิวเคลือบ' },
    shortThickness:      { vi:'Độ dày', en:'Thickness', th:'ความหนา' },
    shortType:           { vi:'Loại ván', en:'Board type', th:'ประเภทแผ่น' },
    shortMoisture:       { vi:'Chống ẩm', en:'Moisture', th:'กันชื้น' },
    shortSize:           { vi:'Khổ ván', en:'Sheet size', th:'ขนาดแผ่น' },
    shortGlue:           { vi:'Loại keo', en:'Glue', th:'ชนิดกาว' },
    shortQuality:        { vi:'Chất lượng', en:'Quality', th:'คุณภาพ' },
    statusOk:            { vi:'Còn hàng', en:'In stock', th:'มีสินค้า' },
    statusWarn:          { vi:'Sắp hết', en:'Low stock', th:'ใกล้หมด' },
    statusBad:           { vi:'Hết hàng', en:'Out of stock', th:'สินค้าหมด' },
    statusNone:          { vi:'Chưa khớp dữ liệu', en:'Unmatched', th:'ไม่พบข้อมูลตรงกัน' },
    selectAll:           { vi:'Chọn tất cả', en:'Select all', th:'เลือกทั้งหมด' },
    noneSelected:        { vi:'không chọn gì', en:'none selected', th:'ไม่ได้เลือก' },
    noDataToFilter:      { vi:'Chưa có dữ liệu để lọc — hãy tải tồn kho trước.', en:'No data to filter yet — please load inventory first.', th:'ยังไม่มีข้อมูลให้กรอง — กรุณาโหลดสต๊อกก่อน' },
    sortCatalog:         { vi:'Sắp xếp: theo thứ tự catalogue', en:'Sort: catalogue order', th:'เรียงตาม: ลำดับแคตตาล็อก' },
    sortStockAsc:        { vi:'Sắp xếp: tồn kho thấp → cao', en:'Sort: stock low → high', th:'เรียงตาม: สต๊อกน้อย → มาก' },
    sortStockDesc:       { vi:'Sắp xếp: tồn kho cao → thấp', en:'Sort: stock high → low', th:'เรียงตาม: สต๊อกมาก → น้อย' },
    sortName:            { vi:'Sắp xếp: theo tên A→Z', en:'Sort: name A→Z', th:'เรียงตาม: ชื่อ A→Z' },
    gridHeadName:        { vi:'Tên màu / Mã', en:'Color name / Code', th:'ชื่อสี / รหัส' },
    gridHeadFinish:      { vi:'Bề mặt', en:'Finish', th:'ผิวเคลือบ' },
    gridHeadTotal:       { vi:'Tồn (gộp)', en:'Total stock', th:'สต๊อกรวม' },
    gridHeadStatus:      { vi:'Trạng thái', en:'Status', th:'สถานะ' },
    footerIndex1:        { vi:'Công cụ nội bộ · dữ liệu đọc trực tiếp từ Google Sheet hoặc file bạn tải lên, không lưu trữ trên máy chủ nào khác.', en:'Internal tool · data is read directly from your Google Sheet or uploaded file, and is not stored on any other server.', th:'เครื่องมือภายใน · ข้อมูลอ่านโดยตรงจาก Google Sheet หรือไฟล์ที่คุณอัปโหลด ไม่ถูกจัดเก็บบนเซิร์ฟเวอร์อื่นใด' },
    footerIndex2:        { vi:'"Tồn (gộp)" là tổng số theo tất cả dòng vật tư khớp với màu — có thể gồm nhiều loại (HPL / MDF / Ván dăm) và đơn vị khác nhau; bấm để xem chi tiết từng dòng.', en:'"Total stock" is the sum of all item rows matching this color — it may include several board types (HPL / MDF / Particle board) and different units; click to see line-by-line detail.', th:'"สต๊อกรวม" คือผลรวมของทุกแถวสินค้าที่ตรงกับสีนี้ — อาจรวมหลายประเภท (HPL / MDF / ไม้อัดชิ้น) และหน่วยต่างกัน คลิกเพื่อดูรายละเอียดแต่ละแถว' },

    // dynamic messages (index)
    msgNoMatch:          { vi:'Không tìm thấy gì khớp với "{q}". Thử gõ ngắn hơn, ví dụ chỉ mã màu.', en:'No matches found for "{q}". Try a shorter search, e.g. just the color code.', th:'ไม่พบผลลัพธ์ที่ตรงกับ "{q}" ลองพิมพ์สั้นลง เช่น รหัสสีเท่านั้น' },
    msgSearchHintMin:    { vi:'Nhập ít nhất 2 ký tự để tìm trong {n} màu catalogue và toàn bộ mã tồn kho.', en:'Enter at least 2 characters to search {n} catalogue colors and all inventory codes.', th:'ป้อนอย่างน้อย 2 ตัวอักษรเพื่อค้นหาในสี {n} รายการของแคตตาล็อกและรหัสสต๊อกทั้งหมด' },
    msgSearchResult:     { vi:'{c} màu catalogue khớp · {r} dòng tồn kho khớp', en:'{c} catalogue colors matched · {r} inventory rows matched', th:'สีในแคตตาล็อกที่ตรงกัน {c} รายการ · แถวสต๊อกที่ตรงกัน {r} รายการ' },
    msgNoInventoryYet:   { vi:'  (chưa tải dữ liệu tồn kho — chỉ tìm trong catalogue)', en:'  (inventory not loaded yet — searching catalogue only)', th:'  (ยังไม่ได้โหลดข้อมูลสต๊อก — ค้นหาเฉพาะในแคตตาล็อก)' },
    unitColors:          { vi:'màu', en:'colors', th:'สี' },
    unitRows:            { vi:'dòng', en:'rows', th:'รายการ' },
    statusPleaseInputLink:{ vi:'Vui lòng dán link Google Sheet', en:'Please paste a Google Sheet link', th:'กรุณาวางลิงก์ Google Sheet' },
    statusBadLink:       { vi:'Không đọc được ID từ link, kiểm tra lại', en:'Could not read the ID from the link, please check', th:'อ่านรหัส ID จากลิงก์ไม่ได้ กรุณาตรวจสอบอีกครั้ง' },
    statusLoading:       { vi:'Đang tải…', en:'Loading…', th:'กำลังโหลด…' },
    statusReadingFile:   { vi:'Đang đọc file…', en:'Reading file…', th:'กำลังอ่านไฟล์…' },
    statusNotPublicShare: { vi:'Sheet chưa được chia sẻ ở chế độ xem công khai, hoặc sai tên tab.', en:'The sheet is not shared for public viewing, or the tab name is wrong.', th:'ชีตยังไม่ได้แชร์แบบดูสาธารณะ หรือชื่อแท็บไม่ถูกต้อง' },
    statusSheetError:    { vi:'Lỗi tải Google Sheet: {e}', en:'Error loading Google Sheet: {e}', th:'เกิดข้อผิดพลาดในการโหลด Google Sheet: {e}' },
    statusFileError:     { vi:'Lỗi đọc file: {e}', en:'Error reading file: {e}', th:'เกิดข้อผิดพลาดในการอ่านไฟล์: {e}' },
    statusLoadedIndex:   { vi:'Đã tải {n} dòng từ {src} · {time}', en:'Loaded {n} rows from {src} · {time}', th:'โหลดแล้ว {n} แถวจาก {src} · {time}' },
    detailNoRowsFiltered:{ vi:'Màu này có dữ liệu tồn kho, nhưng không có dòng nào khớp các điều kiện đang lọc (loại ván / cấp chống ẩm / loại keo / độ dày / khổ ván / mã khuôn-mặt / cấp chất lượng). Thử bỏ bớt điều kiện lọc.',
                            en:'This color has inventory data, but no row matches the current filters (board type / moisture grade / glue / thickness / sheet size / finish / quality grade). Try removing some filters.',
                            th:'สีนี้มีข้อมูลสต๊อก แต่ไม่มีแถวใดตรงกับตัวกรองปัจจุบัน (ประเภทแผ่น / ระดับกันชื้น / ชนิดกาว / ความหนา / ขนาดแผ่น / ผิวเคลือบ / เกรดคุณภาพ) ลองลบตัวกรองบางส่วนออก' },
    detailNoRowsAtAll:   { vi:'Không tìm thấy dòng vật tư nào khớp với màu này trong dữ liệu tồn kho hiện tại.', en:'No item rows in the current inventory data match this color.', th:'ไม่พบแถวสินค้าใดในข้อมูลสต๊อกปัจจุบันที่ตรงกับสีนี้' },
    noHeaderRowError:    { vi:'Không tìm thấy dòng tiêu đề (cần có cột "Mã vật tư", "Tên vật tư", "Tồn cuối").', en:'Header row not found (needs columns "Mã vật tư", "Tên vật tư", "Tồn cuối").', th:'ไม่พบแถวหัวตาราง (ต้องมีคอลัมน์ "Mã vật tư", "Tên vật tư", "Tồn cuối")' },

    // ---------- lap-don-hang.html (lập đơn hàng) ----------
    pageTitleOrder:      { vi:'PANEL PLUS Việt Nam · Lập đơn hàng nhanh', en:'PANEL PLUS Vietnam · Quick Order Builder', th:'PANEL PLUS เวียดนาม · สร้างใบสั่งซื้ออย่างรวดเร็ว' },
    h1Order:             { vi:'Lập đơn hàng nhanh', en:'Quick Order Builder', th:'สร้างใบสั่งซื้ออย่างรวดเร็ว' },
    ledeOrder:           { vi:'Điền mã vật tư để tự nhảy tên sản phẩm và đơn giá theo dữ liệu tồn kho / bảng giá. Có thể thêm, xoá dòng và tự tính thuế, phí vận chuyển.',
                            en:'Enter an item code to auto-fill the product name and unit price from inventory / price list data. You can add or remove lines, and tax and shipping are calculated automatically.',
                            th:'ป้อนรหัสสินค้าเพื่อให้ชื่อสินค้าและราคาต่อหน่วยเติมอัตโนมัติจากข้อมูลสต๊อก/ตารางราคา สามารถเพิ่ม/ลบแถวได้ และภาษี ค่าขนส่งจะคำนวณให้อัตโนมัติ' },
    sourceCardTitleOrder:{ vi:'Nguồn dữ liệu (Tồn kho · Bảng giá · Phân loại màu)', en:'Data source (Inventory · Price list · Color classification)', th:'แหล่งข้อมูล (สต๊อก · ตารางราคา · การจัดกลุ่มสี)' },
    tabTonKhoLabel:      { vi:'Tên tab tồn kho', en:'Inventory tab name', th:'ชื่อแท็บสต๊อก' },
    tabBangGiaLabel:     { vi:'Tên tab bảng giá', en:'Price list tab name', th:'ชื่อแท็บตารางราคา' },
    tabPhanLoaiMauLabel: { vi:'Tên tab phân loại màu', en:'Color classification tab name', th:'ชื่อแท็บการจัดกลุ่มสี' },
    sheetHintOrder:      { vi:'Dùng đúng 1 Google Sheet có đủ 3 tab: <code>TonKho</code> (Mã vật tư / Tên vật tư / Đvt / Tồn cuối), <code>BangGia</code> (Loai_Van / Cap_Keo / Nhom_Mau / Do_Day_mm / Kho / Don_Gia_VND / Ghi_Chu) và <code>PhanLoaiMau</code> (Ma_Mau / HPL_Code / Phan_Loai) — đúng cấu trúc file gốc bạn đang dùng cho Apps Script tra cứu giá. Nếu thiếu tab bảng giá, công cụ vẫn tra được tên sản phẩm nhưng không tự tính được đơn giá.',
                            en:'Use a single Google Sheet with all 3 tabs: <code>TonKho</code> (Item code / Item name / Unit / Ending stock), <code>BangGia</code> (Board type / Glue grade / Color group / Thickness mm / Sheet size / Unit price VND / Note) and <code>PhanLoaiMau</code> (Color code / HPL code / Group) — matching the original file structure used for your price-lookup Apps Script. If the price-list tab is missing, the tool can still look up the product name but won\'t auto-calculate a price.',
                            th:'ใช้ Google Sheet เดียวที่มีครบ 3 แท็บ: <code>TonKho</code> (รหัสสินค้า / ชื่อสินค้า / หน่วย / สต๊อกคงเหลือ), <code>BangGia</code> (ประเภทแผ่น / ระดับกาว / กลุ่มสี / ความหนา มม. / ขนาดแผ่น / ราคาต่อหน่วย VND / หมายเหตุ) และ <code>PhanLoaiMau</code> (รหัสสี / รหัส HPL / กลุ่ม) — ตรงกับโครงสร้างไฟล์ต้นฉบับที่ใช้กับ Apps Script ค้นหาราคา หากไม่มีแท็บตารางราคา เครื่องมือยังค้นชื่อสินค้าได้แต่จะไม่คำนวณราคาให้อัตโนมัติ' },
    fileHintOrder:       { vi:'Dùng đúng file Excel gốc có đủ 3 sheet <code>TonKho</code> (hoặc <code>Main</code>), <code>BangGia</code>, <code>PhanLoaiMau</code> — công cụ tự tìm đúng sheet theo tên, không cần chỉnh sửa gì trước khi tải lên.',
                            en:'Use the original Excel file with all 3 sheets <code>TonKho</code> (or <code>Main</code>), <code>BangGia</code>, <code>PhanLoaiMau</code> — the tool finds the right sheet by name automatically, no editing needed before upload.',
                            th:'ใช้ไฟล์ Excel ต้นฉบับที่มีครบ 3 ชีต <code>TonKho</code> (หรือ <code>Main</code>), <code>BangGia</code>, <code>PhanLoaiMau</code> — เครื่องมือจะค้นหาชีตที่ถูกต้องตามชื่อให้อัตโนมัติ ไม่ต้องแก้ไขก่อนอัปโหลด' },

    customerLabel:       { vi:'Khách hàng', en:'Customer', th:'ลูกค้า' },
    customerPlaceholder: { vi:'Tên công ty / cá nhân khách hàng', en:'Customer company / individual name', th:'ชื่อบริษัท / ลูกค้ารายบุคคล' },
    orderCodeLabel:      { vi:'Mã đơn hàng', en:'Order code', th:'รหัสใบสั่งซื้อ' },
    orderDateLabel:      { vi:'Ngày lập', en:'Date created', th:'วันที่สร้าง' },
    shipToLabel:         { vi:'Vận chuyển đến (địa chỉ giao hàng)', en:'Ship to (delivery address)', th:'จัดส่งถึง (ที่อยู่จัดส่ง)' },
    shipToPlaceholder:   { vi:'Địa chỉ nhận hàng…', en:'Delivery address…', th:'ที่อยู่รับสินค้า…' },
    shipFeeLabel:        { vi:'Đơn giá vận chuyển (VNĐ)', en:'Shipping fee (VND)', th:'ค่าขนส่ง (VND)' },
    saleRepLabel:        { vi:'Người lập đơn', en:'Prepared by', th:'ผู้จัดทำ' },
    saleRepPlaceholder:  { vi:'Tên nhân viên', en:'Staff name', th:'ชื่อพนักงาน' },

    lineListTitle:       { vi:'Danh sách sản phẩm', en:'Product lines', th:'รายการสินค้า' },
    lineCountUnit:       { vi:'dòng', en:'lines', th:'รายการ' },
    tableHint:           { vi:'💡 Kéo ngang để xem hết các cột trên màn hình nhỏ. Chạm biểu tượng cạnh Đơn giá để xem lý do tự đoán giá.',
                            en:'💡 Swipe sideways to see all columns on small screens. Tap the icon next to Unit price to see why the price was auto-filled.',
                            th:'💡 เลื่อนแนวนอนเพื่อดูคอลัมน์ทั้งหมดบนหน้าจอเล็ก แตะไอคอนข้างราคาต่อหน่วยเพื่อดูเหตุผลของราคาที่เดาให้อัตโนมัติ' },
    addLineBtn:          { vi:'+ Thêm dòng sản phẩm', en:'+ Add product line', th:'+ เพิ่มรายการสินค้า' },

    thSkuShort:          { vi:'Mã vật tư', en:'Item code', th:'รหัสสินค้า' },
    thNameShort:         { vi:'Tên vật tư', en:'Item name', th:'ชื่อสินค้า' },
    thUnitShort:         { vi:'ĐVT', en:'Unit', th:'หน่วย' },
    thQty:               { vi:'SL', en:'Qty', th:'จำนวน' },
    thUnitPrice:         { vi:'Đơn giá (VNĐ)', en:'Unit price (VND)', th:'ราคาต่อหน่วย (VND)' },
    thDiscount:          { vi:'CK %', en:'Disc %', th:'ส่วนลด %' },
    thTax:               { vi:'Thuế', en:'Tax', th:'ภาษี' },
    thTotal:             { vi:'Thành tiền', en:'Line total', th:'ยอดรวม' },
    taxOther:            { vi:'Khác…', en:'Other…', th:'อื่นๆ…' },
    skuPlaceholder:      { vi:'Mã…', en:'Code…', th:'รหัส…' },
    namePlaceholder:     { vi:'Tự động theo mã vật tư, hoặc gõ tay', en:'Auto-filled from item code, or type manually', th:'เติมอัตโนมัติจากรหัสสินค้า หรือพิมพ์เอง' },
    removeLineTitle:      { vi:'Xoá dòng', en:'Remove line', th:'ลบรายการ' },
    noSkuMatch:          { vi:'Không tìm thấy mã khớp.', en:'No matching code found.', th:'ไม่พบรหัสที่ตรงกัน' },

    totSubtotalLabel:    { vi:'Tổng tiền hàng (trước chiết khấu, trước thuế)', en:'Subtotal (before discount, before tax)', th:'ยอดรวมสินค้า (ก่อนส่วนลด ก่อนภาษี)' },
    totDiscountLabel:    { vi:'Tổng chiết khấu', en:'Total discount', th:'ส่วนลดรวม' },
    totTaxLabel:         { vi:'Tổng tiền thuế', en:'Total tax', th:'ภาษีรวม' },
    totShipLabel:        { vi:'Phí vận chuyển', en:'Shipping fee', th:'ค่าขนส่ง' },
    totGrandLabel:       { vi:'TỔNG CỘNG THANH TOÁN', en:'GRAND TOTAL', th:'ยอดรวมสุทธิ' },
    clearOrderBtn:       { vi:'Xoá toàn bộ đơn', en:'Clear order', th:'ล้างใบสั่งซื้อทั้งหมด' },
    printBtn:            { vi:'In / Xuất PDF đơn hàng', en:'Print / Export order as PDF', th:'พิมพ์ / ส่งออกใบสั่งซื้อเป็น PDF' },
    footerOrder:         { vi:'PANEL PLUS Việt Nam · Công cụ nội bộ · Giá tự động chỉ mang tính gợi ý, luôn kiểm tra lại trước khi chốt đơn.',
                            en:'PANEL PLUS Vietnam · Internal tool · Auto-filled prices are suggestions only — always double-check before finalizing an order.',
                            th:'PANEL PLUS เวียดนาม · เครื่องมือภายใน · ราคาที่เติมอัตโนมัติเป็นเพียงคำแนะนำ กรุณาตรวจสอบอีกครั้งก่อนปิดการขาย' },
    clearOrderConfirm:   { vi:'Xoá toàn bộ danh sách sản phẩm trong đơn hàng này?', en:'Clear all product lines in this order?', th:'ล้างรายการสินค้าทั้งหมดในใบสั่งซื้อนี้ใช่หรือไม่?' },

    // dynamic messages (order)
    priceReasonInsufficient: { vi:'Không đủ thông tin để tự đoán giá — vui lòng nhập tay.', en:'Not enough information to auto-estimate a price — please enter manually.', th:'ข้อมูลไม่เพียงพอที่จะประเมินราคาอัตโนมัติ — กรุณากรอกเอง' },
    priceReasonMatched:      { vi:'Khớp: {info}', en:'Matched: {info}', th:'ตรงกัน: {info}' },
    priceReasonNoRow:        { vi:'Không tìm thấy dòng giá khớp trong Bảng giá — vui lòng nhập tay.', en:'No matching row found in the price list — please enter manually.', th:'ไม่พบแถวราคาที่ตรงกันในตารางราคา — กรุณากรอกเอง' },
    priceReasonNoGroup:      { vi:'Ván đã phủ bề mặt/màu nhưng không xác định được nhóm màu (mã màu chưa có trong PhanLoaiMau) — vui lòng nhập tay để tránh sai giá.',
                                en:'The board is coated/colored but the color group could not be identified (color code not found in PhanLoaiMau) — please enter manually to avoid a wrong price.',
                                th:'แผ่นนี้เคลือบผิว/มีสีแล้ว แต่ไม่สามารถระบุกลุ่มสีได้ (ไม่พบรหัสสีใน PhanLoaiMau) — กรุณากรอกราคาเองเพื่อหลีกเลี่ยงราคาที่ผิดพลาด' },
    skuNotFound:              { vi:'Không tìm thấy mã vật tư này trong dữ liệu tồn kho.', en:'This item code was not found in the inventory data.', th:'ไม่พบรหัสสินค้านี้ในข้อมูลสต๊อก' },
    statusPleaseInputLinkOrder: { vi:'Vui lòng dán link Google Sheet', en:'Please paste a Google Sheet link', th:'กรุณาวางลิงก์ Google Sheet' },
    statusMissingTonKhoSheet: { vi:'Không tìm thấy sheet "TonKho" trong file.', en:'Sheet "TonKho" not found in the file.', th:'ไม่พบชีต "TonKho" ในไฟล์' },
    statusMissingBangGiaSheet: { vi:'Không tìm thấy sheet "BangGia" trong file.', en:'Sheet "BangGia" not found in the file.', th:'ไม่พบชีต "BangGia" ในไฟล์' },
    statusMissingPhanLoaiSheet: { vi:'Không tìm thấy sheet "PhanLoaiMau" trong file.', en:'Sheet "PhanLoaiMau" not found in the file.', th:'ไม่พบชีต "PhanLoaiMau" ในไฟล์' },
    statusNoDataRead:        { vi:'Không đọc được dữ liệu.', en:'Could not read the data.', th:'ไม่สามารถอ่านข้อมูลได้' },
    statusLoadedOrder:       { vi:'Đã tải: {skus} SKU tồn kho · {prices} dòng bảng giá · {colors} mã màu — từ {src}',
                                en:'Loaded: {skus} inventory SKUs · {prices} price-list rows · {colors} color codes — from {src}',
                                th:'โหลดแล้ว: {skus} SKU สต๊อก · {prices} แถวตารางราคา · {colors} รหัสสี — จาก {src}' },
    unitSkus:                { vi:'SKU tồn kho', en:'inventory SKUs', th:'SKU สต๊อก' },
    unitPriceRows:           { vi:'dòng bảng giá', en:'price-list rows', th:'แถวตารางราคา' },
    unitColorCodes:          { vi:'mã màu', en:'color codes', th:'รหัสสี' },
  };

  function getLang(){
    try{
      const saved = localStorage.getItem('pnp_lang');
      if(saved && LANGS.includes(saved)) return saved;
    }catch(e){}
    return 'vi';
  }

  let currentLang = getLang();

  function t(key, vars){
    const entry = DICT[key];
    let str = entry ? (entry[currentLang] || entry.vi || '') : key;
    if(vars){
      Object.keys(vars).forEach(k=>{
        str = str.split('{'+k+'}').join(vars[k]);
      });
    }
    return str;
  }

  function applyStaticI18n(root){
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(el=>{
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    scope.querySelectorAll('[data-i18n-html]').forEach(el=>{
      el.innerHTML = t(el.getAttribute('data-i18n-html'));
    });
    scope.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    scope.querySelectorAll('[data-i18n-title]').forEach(el=>{
      el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    });
  }

  function setLang(lang){
    if(!LANGS.includes(lang)) return;
    currentLang = lang;
    try{ localStorage.setItem('pnp_lang', lang); }catch(e){}
    document.documentElement.setAttribute('lang', lang);
    applyStaticI18n(document);
    const sw = document.getElementById('langSwitcher');
    if(sw) sw.value = lang;
    global.dispatchEvent(new CustomEvent('i18n:change', {detail:{lang}}));
  }

  function buildLangSwitcher(){
    const sel = document.createElement('select');
    sel.id = 'langSwitcher';
    sel.setAttribute('aria-label', 'Ngôn ngữ / Language / ภาษา');
    sel.className = 'lang-switcher';
    LANGS.forEach(l=>{
      const opt = document.createElement('option');
      opt.value = l;
      opt.textContent = LANG_FLAGS[l] + ' ' + LANG_NAMES[l];
      if(l === currentLang) opt.selected = true;
      sel.appendChild(opt);
    });
    sel.addEventListener('change', ()=> setLang(sel.value));
    return sel;
  }

  global.PNP_I18N = { t, setLang, getLang, applyStaticI18n, buildLangSwitcher, LANGS, LANG_NAMES };

  document.addEventListener('DOMContentLoaded', function(){
    document.documentElement.setAttribute('lang', currentLang);
    applyStaticI18n(document);
  });

})(window);
