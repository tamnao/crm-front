<template>
	<div class="top-menu">
		<nav>
			<ul class="nav-gnb nav-menu">
				<li>
					<a href="/">Home</a>
				</li>
                <li>
					<a href="/about">About</a>
				</li>
                <li>
					<a href="/security/login">Login</a>
				</li>
                <li>
					<a href="/examples/chart">Charts</a>
				</li>
			</ul>
		</nav>
	</div>
</template>

<style scoped>
.el-select {
	width: 120px;
	margin-top: 20px;
}
.nav-gnb {
    display: inline-block;
    zoom: 1;
    margin-top: 20px;
}
.nav-gnb > li {
    float: left;
    position: relative;
    height: 80px;
}
.nav-gnb > li > a {
    display: block;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-right: 16px;
    padding-left: 16px;
    font-size: 16px;
    color: #666;
    cursor: pointer;
}
dl, ol, ul, li {
    list-style: none;
}
</style>
