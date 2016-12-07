
function displayTitle(title) {
    // make a similar title for all JS example presented in this course:
    var titleAsHeader = "<header><h1>&nbsp;" + title + "<br /></h1><br>&nbsp;&nbsp;<a href='http://webgl3d.info' style='text-decoration:none; color: white;'>Karim Luy, 2016</a></header>";
    document.write(titleAsHeader);
    document.title = title;
}

