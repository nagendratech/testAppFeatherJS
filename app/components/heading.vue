<template lang="jade">
	header.intro-header()
	  .container
	    .row
	      .col-lg-8.col-lg-offset-2.col-md-10.col-md-offset-1
	        .page-heading
	          h1 {{$route.name}}
	          hr.small
	          span.subheading {{$route.meta.subtitle}}
</template>

<script>
module.exports = {
  store: ['routes', 'tasks']
}
</script>
